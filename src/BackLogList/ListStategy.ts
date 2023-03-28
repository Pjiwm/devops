import { BacklogItem } from "../BackLogItem";
import { Observer } from "../Observer/Observer";

// ListStategy interface (Strategy)
export abstract class ListStategy {

    private backlogItems: BacklogItem[];
    private name: string;
    private observers: Observer[];

    constructor(backlogItems: BacklogItem[], name: string, observers: Observer[]) {
        this.backlogItems = backlogItems
        this.name = name
        this.observers = observers
    }

    public abstract addBacklogItem(backlogItem: BacklogItem): void;
    public abstract removeBacklogItem(backlogItem: BacklogItem): void;
    public abstract getName(): string;
    public abstract contains(backlogItem: BacklogItem): boolean
    public abstract getBacklogItems(): BacklogItem[];
}