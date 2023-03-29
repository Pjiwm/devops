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
import { Tester } from '../Roles/Tester';

export class Sprint implements Subject {

    private members: Person<Role>[];
    private backlog: SprintBacklog;
    private props: SprintProperties;
    private state: State;
    private observers: Observer[] = [];
    private id: string;
    private scrumMaster: Person<ScrumMaster>;
    private leadDeveloper: Person<LeadDeveloper>
    readonly sprintType: SprintType;

    constructor(scrumMaster: Person<ScrumMaster>, leadDeveloper: Person<LeadDeveloper>, members: Person<Role>[], backlog: SprintBacklog, startDate: Date, endDate: Date, name: string, type: SprintType) {
        members.push(scrumMaster, leadDeveloper);
        this.members = members;
        this.backlog = backlog;
        this.props = new SprintProperties(name, startDate, endDate);
        this.state = new CreatedState();
        this.id = nanoid();
        this.sprintType = type;
        this.scrumMaster = scrumMaster;
        this.leadDeveloper = leadDeveloper;

        this.members.forEach(member => { 
            if(member.roleActions() instanceof Tester) {
                this.backlog.getReadyForTesting().addPerson(member);
            }
         })
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

    getReadyForTestingList(): ListStategy {
        return this.backlog.getReadyForTesting();
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
        if(person === this.getScrumMaster()) {
            this.state.start(this);
        } else {
            this.notifyObservers(`A sprint can only be started by a scrum master`);
        }
    }

    finish(): void {
        this.state.finish(this);
    }

    addBacklogItem(item: BacklogItem): void {
        // TODO this can be made better...
        this.state.addBacklogItem(this, this.getBackLogLists()[0], item);
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

    changeBacklogItemPosition(item: BacklogItem, sourceList: ListStategy, destinationList: ListStategy): void {
        this.state.changeBacklogItemPosition(this, item, sourceList, destinationList);
    }

}
