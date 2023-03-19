import { nanoid } from 'nanoid';
import { BacklogItem } from './BackLogItem'
import { BacklogList } from './BackLogList/BackLogList';
import { Observer } from './Observer/Observer';
import { Subject } from './Observer/Subject';

// SprintBacklog class (Context)
export class SprintBacklog implements Subject {
    private backlogLists: BacklogList[];
    private backlogItems: BacklogItem[];
    private observers: Observer[];
    private id: string;

    constructor(backlogLists: BacklogList[]) {
        this.backlogLists = backlogLists;
        this.backlogItems = [];
        this.observers = [];
        this.id = nanoid();
    }

    public getId(): string {
        return this.id;
    }

    public getBacklogLists(): BacklogList[] {
        return this.backlogLists;
    }

    public getBacklogItems(): BacklogItem[] {
        return this.backlogItems;
    }

    public setBacklogItems(backlogItems: BacklogItem[]) {
        this.backlogItems = backlogItems;
        this.notifyObservers();
    }

    public addBacklogItem(backlogItem: BacklogItem): void {
        this.backlogItems.push(backlogItem);
        this.notifyObservers();
    }

    public removeBacklogItem(backlogItem: BacklogItem): void {
        const index = this.backlogItems.indexOf(backlogItem);
        if (index !== -1) {
            this.backlogItems.splice(index, 1);
            this.notifyObservers();
        }
    }

    public removeBacklogItemById(id: string): BacklogItem {
        let result = this.backlogItems.findIndex((item) => item.getId() == id);
        if (result == -1) {
            throw new Error('BacklogItem not found');
        } else {
            this.notifyObservers();
            return this.backlogItems.splice(result, 1)[0];
        }

    }

    public addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    public notifyObservers(): void {
        for (const observer of this.observers) {
            observer.update(this);
        }
    }

    public toString(): string {
        let lists = this.backlogLists.map((list) => list.getName());
        return `[SprintBackLog-${this.id}]: lists: [${lists}]`;

    }
}