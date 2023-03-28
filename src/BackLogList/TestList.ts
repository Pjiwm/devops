import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "./ListStategy";
import { Observer } from "../Observer/Observer";

// TestList class (Concrete Strategy)
export class TestList extends ListStategy {

    constructor(name: string) {
        super(name);
    }

    getName(): string {
        return this.getName();
    }

    getBacklogItems(): BacklogItem[] {
        return this.getBacklogItems();
    }

    contains(backlogItem: BacklogItem): boolean {
        return this.getBacklogItems().includes(backlogItem);
    }

    addBacklogItem(backlogItem: BacklogItem): void {
        this.getBacklogItems().push(backlogItem);
    }

    removeBacklogItem(backlogItem: BacklogItem): void {
        const index = this.getBacklogItems().indexOf(backlogItem);
        if (index !== -1) {
            this.getBacklogItems().splice(index, 1);
        }
    }
}