import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "./ListStategy";
import { Observer } from "../Observer/Observer";

// TestedList class (Concrete Strategy)
export class TestedList extends ListStategy {

    constructor(name: string) {
        super(name);
    }

    public getName(): string {
        return this.getName();
    }

    public getBacklogItems(): BacklogItem[] {
        return this.getBacklogItems();
    }

    contains(backlogItem: BacklogItem): boolean {
        return this.getBacklogItems().includes(backlogItem);
    }

    public addBacklogItem(backlogItem: BacklogItem): void {
        this.getBacklogItems().push(backlogItem);
    }

    public removeBacklogItem(backlogItem: BacklogItem): void {
        const index = this.getBacklogItems().indexOf(backlogItem);
        if (index !== -1) {
            this.getBacklogItems().splice(index, 1);
        }
    }
}