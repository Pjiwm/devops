import { Role } from "./Role";

export class LeadDeveloper extends Role {
    constructor() {
        super();
        super.name = "Lead Developer";
    }

    public doLeadDevStuff() {
        console.log("I'm a lead developer, I do lead dev stuff");
    }
  }