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

    public getTodoList(): ListStategy {
        return this.backlogLists[0];
    }

    public getInProgressList(): ListStategy {
        return this.backlogLists[1];
    }

    public getDoneList(): ListStategy {
        return this.backlogLists[this.backlogLists.length - 1];
    }

    public getTestingList(): ListStategy {
        return this.backlogLists[this.backlogLists.length - 2];
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