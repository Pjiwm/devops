import { Role } from "./Role";

export class ScrumMaster extends Role {

    constructor() {
        super();
        super.name = "Scrum Master";
    }

    public doScrumMasterStuff() {
        console.log("I'm a scrum master, I do scrum master stuff");
    }
}