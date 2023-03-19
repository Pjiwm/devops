import { Role } from "./Role";

export class Developer extends Role {
    constructor() {
        super();
        super.name = "Developer";
    }

    public doDevStuff() {
        console.log("I'm a developer, I do dev stuff");
    }

  }