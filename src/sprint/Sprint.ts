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

export class Sprint implements Subject {
    private members: Person<Role>[];
    private backlog: SprintBacklog;
    private startDate: Date;
    private endDate: Date;
    private state: State;
    private observers: Observer[] = [];
    private name: string;

    constructor(members: Person<Role>[], backlog: SprintBacklog, startDate: Date, endDate: Date, name: string) {
        this.members = members;
        this.backlog = backlog;
        this.startDate = startDate;
        this.endDate = endDate;
        this.state = new CreatedState();
        this.name = name;
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

    setStartDate(startDate: Date): void {
        this.startDate = startDate;
    }

    setEndDate(endDate: Date): void {
        this.endDate = endDate;
    }

    setName(name: string): void {
        this.name = name;
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

    start(): void {
        this.state.start(this);
    }

    finish(): void {
        this.state.finish(this);
    }

    addBacklogItem(item: BacklogItem): void {
        this.state.addBacklogItem(this, item);
    }

    removeBacklogItem(item: BacklogItem): void {
        this.state.removeBacklogItem(this, item);
    }

    changeBacklogItemPosition(item: BacklogItem, sourceList: BacklogList, destinationList: BacklogList): void {
        this.state.changeBacklogItemPosition(this, item, sourceList, destinationList);
    }

    // getters and setters for name and state
}
