import { nanoid } from 'nanoid';
import { BacklogItem } from './BackLogItem'
import { ListStategy } from './BackLogList/ListStategy';
import { Observer } from './Observer/Observer';
import { Subject } from './Observer/Subject';
import { Repository } from './Repository';

// SprintBacklog class (Context)
export class SprintBacklog implements Subject {
    private backlogLists: ListStategy[];
    private backlogItems: BacklogItem[];
    private observers: Observer[];
    private id: string;
    private repostiory: Repository;

    constructor(backlogLists: ListStategy[], repository: Repository) {
        this.backlogLists = backlogLists;
        this.backlogItems = [];
        this.observers = [];
        this.id = nanoid();
        this.repostiory = repository;
    }

    public getId(): string {
        return this.id;
    }

    public getBacklogLists(): ListStategy[] {
        return this.backlogLists;
    }

    public getRepository(): Repository {
        return this.repostiory;
    }

    public getBacklogItems(): BacklogItem[] {
        return this.backlogItems;
    }

    public setBacklogItems(backlogItems: BacklogItem[]) {
        this.backlogItems = backlogItems;
        this.notifyObservers("Set backlog items");
    }

    public addBacklogItem(backlogItem: BacklogItem): void {
        this.backlogItems.push(backlogItem);
        this.notifyObservers(`Added backlog item ${backlogItem.getId()}`);
    }

    public removeBacklogItem(backlogItem: BacklogItem): void {
        const index = this.backlogItems.indexOf(backlogItem);
        if (index !== -1) {
            this.backlogItems.splice(index, 1);
            this.notifyObservers(`Removed backlog item ${backlogItem.getId()}`);
        }
    }

    public removeBacklogItemById(id: string): BacklogItem {
        let result = this.backlogItems.findIndex((item) => item.getId() == id);
        if (result == -1) {
            throw new Error('BacklogItem not found');
        } else {
            this.notifyObservers(`Removed backlog item by id ${id}`);
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

    public notifyObservers(message: string): void {
        for (const observer of this.observers) {
            observer.update(this, message);
        }
    }

    public toString(): string {
        let lists = this.backlogLists.map((list) => list.getName());
        return `[SprintBackLog-${this.id}]: lists: [${lists}]`;

    }
}