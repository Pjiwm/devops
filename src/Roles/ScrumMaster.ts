import { Person } from "../Person";
import { SprintBuilder } from "../sprint/SprintBuilder";
import { Role } from "./Role";

export class ScrumMaster extends Role {

    constructor() {
        super();
        super.name = "Scrum Master";
    }

    public doScrumMasterStuff() {
        console.log("I'm a scrum master, I do scrum master stuff");
    }

    public createSprint(scrumMaster: Person<ScrumMaster>): SprintBuilder {
        return new SprintBuilder(scrumMaster);
    }
}