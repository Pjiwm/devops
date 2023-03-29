import { BacklogItem } from "../BackLogItem";
import { Observer } from "../Observer/Observer";
import { Person } from "../Person";
import { Role } from "../Roles/Role";
import { ListStategy } from "./ListStategy";

// ReadyForTestingList class (Concrete Strategy)
export class ReadyForTestingList extends ListStategy {
    private testers: Person<Role>[]

    constructor(name: string) {
        super(name);
        this.testers = [];
    }

    public getName(): string {
        return this.getName()
    }

    contains(backlogItem: BacklogItem): boolean {
        return this.getBacklogItems().includes(backlogItem);
    }

    public addBacklogItem(backlogItem: BacklogItem): void {
        this.getBacklogItems().push(backlogItem);
        this.testers.forEach(tester => tester.notifyObservers("A new backlog item is ready for testing"));
    }

    public removeBacklogItem(backlogItem: BacklogItem): void {
        const index = this.getBacklogItems().indexOf(backlogItem);
        if (index !== -1) {
            this.getBacklogItems().splice(index, 1);
        }
    }

    public getBacklogItems(): BacklogItem[] {
        return this.backlogItems;
    }

    public addPerson(person: Person<Role>): void {
        this.testers.push(person);
    }
}