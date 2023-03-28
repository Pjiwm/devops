import { nanoid } from 'nanoid';
import { BacklogItem } from './BackLogItem'
import { BacklogList } from './BackLogList/BackLogList';
import { Observer } from './Observer/Observer';
import { Subject } from './Observer/Subject';
import { Repository } from './Repository';

// SprintBacklog class (Context)
export class SprintBacklog implements Subject {
    private backlogLists: BacklogList[];
    private observers: Observer[];
    private id: string;
    private repostiory: Repository;

    constructor(backlogLists: BacklogList[], repository: Repository) {
        this.backlogLists = backlogLists;
        this.observers = [];
        this.id = nanoid();
        this.repostiory = repository;
    }

    public getId(): string {
        return this.id;
    }

    public getBacklogLists(): BacklogList[] {
        return this.backlogLists;
    }

    public getRepository(): Repository {
        return this.repostiory;
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