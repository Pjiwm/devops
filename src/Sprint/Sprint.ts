import { nanoid } from 'nanoid';
import { BacklogItem } from '../BackLogItem';
import { Observer } from '../Observer/Observer';
import { Subject } from '../Observer/Subject';
import { Person } from '../Person';
import { Role } from '../Roles/Role';
import { SprintBacklog } from '../SprintBackLog';
import { State } from './SprintState';
import { CreatedState } from "./CreatedState";
import { SprintType } from './Type';
import { ScrumMaster } from '../Roles/ScrumMaster';
import { SprintProperties } from './SprintProperties';
import { ListStategy } from '../BackLogList/ListStategy';
import { LeadDeveloper } from '../Roles/LeadDeveloper';
import { ProductOwner } from '../Roles/ProductOwner';
import { Tester } from '../Roles/Tester';
import { Pipeline } from '../Pipeline';
import { ActivatedState } from './ActivatedState';
import * as fs from 'fs';
import { Job } from '../Jobs/Job';

export class Sprint implements Subject {
    private members: Person<Role>[];
    private backlog: SprintBacklog;
    private props: SprintProperties;
    private state: State;
    private observers: Observer[] = [];
    private id: string;
    private scrumMaster: Person<ScrumMaster>;
    private productOwner: Person<ProductOwner>;
    private pipeline: Pipeline;
    private pipelineJobs: Job[];
    private associatedThreads: Observer[];
    readonly sprintType: SprintType;

    constructor(
        productOwner: Person<ProductOwner>,
        scrumMaster: Person<ScrumMaster>,
        leadDeveloper: Person<LeadDeveloper>,
        members: Person<Role>[],
        backlog: SprintBacklog,
        startDate: Date,
        endDate: Date,
        name: string,
        type: SprintType,
        pipelineJobs: Job[]
    ) {

        members.push(scrumMaster, leadDeveloper);
        this.productOwner = productOwner;
        this.members = members;
        this.backlog = backlog;
        this.props = new SprintProperties(name, startDate, endDate);
        this.state = new CreatedState();
        this.id = nanoid();
        this.sprintType = type;
        this.scrumMaster = scrumMaster;
        this.pipelineJobs = pipelineJobs;
        this.pipeline = new Pipeline();
        this.associatedThreads = [];

        this.members.forEach(member => {
            if (member.roleActions() instanceof Tester) {
                this.backlog.getReadyForTesting().addPerson(member);
            }
        })
    }

    getProductOwner(): Person<ProductOwner> {
        return this.productOwner;
    }

    getScrumMaster(): Person<ScrumMaster> {
        return this.scrumMaster;
    }

    getMembers(): Person<Role>[] {
        return this.members;
    }

    getBacklog(): SprintBacklog {
        return this.backlog;
    }

    getTodoList(): ListStategy {
        return this.backlog.getTodoList();
    }

    getDoingList(): ListStategy {
        return this.backlog.getDoingList();
    }

    getReadyForTestingList(): ListStategy {
        return this.backlog.getReadyForTesting();
    }

    getTestingList() {
        return this.backlog.getTestingList();
    }

    getTestedList(): ListStategy {
        return this.backlog.getTestedList();
    }

    getDoneList(): ListStategy {
        return this.backlog.getDoneList();
    }

    getStartDate(): Date {
        return this.props.getStartDate();
    }

    getEndDate(): Date {
        return this.props.getEndDate();
    }

    getState(): State {
        return this.state;
    }

    getName(): string {
        return this.props.getName();
    }

    getId(): string {
        return this.id;
    }

    getPipeline(): Pipeline {
        return this.pipeline;
    }

    getPipelineJobs(): Job[] {
        return this.pipelineJobs;
    }

    setPipeline(pipeline: Pipeline): void {
        this.pipeline = pipeline;
    }

    setId(id: string): void {
        this.id = id;
    }

    setStartDate(startDate: Date): void {
        this.state.setStartDate(this, this.props, startDate);
    }

    setEndDate(endDate: Date): void {
        this.state.setEndDate(this, this.props, endDate);
    }

    setName(name: string): void {
        this.state.setName(this, this.props, name);
    }

    setState(state: State): void {
        this.state = state;
    }

    findBacklogList(item: BacklogItem): ListStategy | undefined {
        for (const list of this.backlog.getBacklogLists()) {
            if (list.contains(item)) {
                return list;
            }
        }
        return undefined;
    }

    // Notify all observers of a change
    notifyObservers(message: string): void {
        for (const observer of this.observers) {
            observer.update(this, message);
        }
    }

    // Add an observer to the list of observers to notify
    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    // Remove an observer from the list of observers to notify
    removeObserver(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    // Perform an action that requires notification of observers
    doAction(action: string): void {
        this.notifyObservers(`Sprint: ${action}`);
    }

    start(person: Person<Role>): void {
        if (person === this.getScrumMaster()) {
            this.state.startSprint(this);
        } else {
            this.notifyObservers(`A sprint can only be started by a scrum master`);
        }
    }

    finish(): void {
        this.state.finishSprint(this);
    }

    close(): void {
        this.state.closeSprint(this);
    }

    addBacklogItem(item: BacklogItem): void {
        this.state.addBacklogItem(this, this.getTodoList(), item);
    }

    swapDeveloper(item: BacklogItem, developer: Person<Role>): void {
        item.swapAssignee(this, developer);
    }

    removeBacklogItem(item: BacklogItem): void {
        this.state.removeBacklogItem(this, item);
    }

    getBackLogLists(): ListStategy[] {
        return this.backlog.getBacklogLists();
    }

    changeBacklogItemPosition(person: Person<Role>, item: BacklogItem, sourceList: ListStategy, destinationList: ListStategy): void {
        if (this.members.includes(person)) {
            this.state.moveBackLogItem(this, person, item, sourceList, destinationList);
            this.checkThreadStatus();
        } else {
            person.notifyObservers(`You are not a member of this sprint!`);
        }
    }

    review(txtFile: string): void {
        if (this.sprintType == SprintType.Review) {
            // Read the contents of the file
            const fileContents = fs.readFileSync(txtFile, 'utf-8');

            // Log the contents of the file to the console
            console.log(`Reviewing file: ${txtFile}`);
            console.log(`File contents: \n${fileContents}`);
        } else {
            this.notifyObservers(`The current sprint is not a review sprint!`);
        }
    }

    release(isApproved: boolean): void {
        if (this.sprintType == SprintType.Release) {
            if (isApproved) {
                this.startPipeline();
            } else {
                this.productOwner.notifyObservers(`The sprint: '${this.props.getName()}' has been cancelled`)
                this.scrumMaster.notifyObservers(`The sprint: '${this.props.getName()}' has been cancelled`)
                this.state.closeSprint(this);
            }
        } else {
            this.notifyObservers(`The current sprint is not a release sprint!`);
        }
    }

    startPipeline(): void {
        this.state.startPipeline(this);
    }

    addAssociatedThread(thread: Observer): void {
        this.associatedThreads.push(thread);
    }

    private checkThreadStatus(): void {
        this.associatedThreads.forEach(thread => {
            thread.update(this, "");
        });
    }
}
