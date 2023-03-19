import { BacklogItem } from "../BackLogItem";
import { BacklogList } from "./BackLogList";

// DoneList class (Concrete Strategy)
export class DoneList implements BacklogList {
    private backlogItems: BacklogItem[];
    private name: string;

    constructor(name: string) {
        this.backlogItems = [];
        this.name = name;
    }

    contains(item: BacklogItem): boolean {
        return this.backlogItems.some((backlogItem) => {
            backlogItem === item;
        });
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