import { BacklogItem } from "../BackLogItem";
import { Observer } from "../Observer/Observer";
import { ListStategy } from "./ListStategy";

// TodoList class (Concrete Strategy)
export class TodoList extends ListStategy {

    constructor(backlogItems: BacklogItem[], name: string, observers: Observer[]) {
        super(backlogItems, name, observers);
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

    public getBacklogItems(): BacklogItem[] {
        return this.getBacklogItems();
    }

    public getName(): string {
        return this.getName();
    }
}