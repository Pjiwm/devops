import { nanoid } from 'nanoid';
import { BacklogItem } from '../BackLogItem';
import { BacklogList } from '../BackLogList/BackLogList';
import { Observer } from '../Observer/Observer';
import { Subject } from '../Observer/Subject';
import { Person } from '../Person';
import { Role } from '../Roles/Role';
import { SprintBacklog } from '../SprintBackLog';
import { State } from './SprintState';
import { CreatedState } from "./CreatedState";
import { SprintType } from './Type';
import { ScrumMaster } from '../Roles/ScrumMaster';

export class Sprint implements Subject {

    private members: Person<Role>[];
    private backlog: SprintBacklog;
    private startDate: Date;
    protected endDate: Date;
    private state: State;
    private observers: Observer[] = [];
    private name: string;
    private id: string;
    private scrumMaster: Person<ScrumMaster>;
    readonly sprintType: SprintType;

    constructor(scrumMaster: Person<ScrumMaster>, members: Person<Role>[], backlog: SprintBacklog, startDate: Date, endDate: Date, name: string, type: SprintType) {
        this.members = members;
        this.backlog = backlog;
        this.startDate = startDate;
        this.endDate = endDate;
        this.state = new CreatedState();
        this.name = name;
        this.id = nanoid();
        this.sprintType = type;
        this.scrumMaster = scrumMaster;
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

    getTodoList(): BacklogList {
        return this.backlog.getBacklogLists()[0];
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    getState(): State {
        return this.state;
    }

    getName(): string {
        return this.name;
    }

    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

    setStartDate(startDate: Date): void {
        this.state.setStartDate(this, startDate);
    }

    setEndDate(endDate: Date): void {
        this.state.setEndDate(this, endDate);
    }

    setName(name: string): void {
        this.state.setName(this, name);
    }

    setState(state: State): void {
        this.state = state;
    }

    findBacklogList(item: BacklogItem): BacklogList | undefined {
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
        this.state.addBacklogItem(this, item);
    }

    swapDeveloper(item: BacklogItem, developer: Person<Role>): void {
        item.swapAssignee(this, developer);
    }

    removeBacklogItem(item: BacklogItem): void {
        this.state.removeBacklogItem(this, item);
    }

    getBackLogLists(): BacklogList[] {
        return this.backlog.getBacklogLists();
    }

    changeBacklogItemPosition(item: BacklogItem, sourceList: BacklogList, destinationList: BacklogList): void {
        this.state.changeBacklogItemPosition(this, item, sourceList, destinationList);
    }

}
