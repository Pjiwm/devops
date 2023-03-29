import { BacklogItem } from "../BackLogItem";
import { Observer } from "../Observer/Observer";

// ListStategy interface (Strategy)
export abstract class ListStategy {

    protected backlogItems: BacklogItem[];
    protected name: string;

    constructor(name: string) {
        this.backlogItems = [];
        this.name = name
    }

    public abstract getName(): string;
    public abstract addBacklogItem(backlogItem: BacklogItem): void;
    public abstract removeBacklogItem(backlogItem: BacklogItem): void;
    public abstract contains(backlogItem: BacklogItem): boolean
    public abstract getBacklogItems(): BacklogItem[];

}