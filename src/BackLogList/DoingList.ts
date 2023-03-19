import { BacklogItem } from "../BackLogItem";
import { BacklogList } from "./BackLogList";

// DoingList class (Concrete Strategy)
export class DoingList implements BacklogList {
    private backlogItems: BacklogItem[];
    private name: string;

    constructor(name: string) {
        this.backlogItems = [];
        this.name = name;

    }

    public addBacklogItem(backlogItem: BacklogItem): void {
        this.backlogItems.push(backlogItem);
    }

    public removeBacklogItem(backlogItem: BacklogItem): void {
        const index = this.backlogItems.indexOf(backlogItem);
        if (index !== -1) {
            this.backlogItems.splice(index, 1);
        }
    }

    public getBacklogItems(): BacklogItem[] {
        return this.backlogItems;
    }

    public getName(): string {
        return this.name
    }
}