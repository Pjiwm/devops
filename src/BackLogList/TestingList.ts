import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "./ListStategy";
import { Person } from "../Person";
import { Role } from "../Roles/Role";

// TestingList class (Concrete Strategy)
export class TestingList extends ListStategy {

    constructor(name: string) {
        super(name);
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

    public addPerson(person: Person<Role>): void {
        person.notifyObservers("User could not be added to this list");
    }
}