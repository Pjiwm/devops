import { Person } from "../Person";
import { SprintBuilder } from "../Sprint/SprintBuilder";
import { LeadDeveloper } from "./LeadDeveloper";
import { ProductOwner } from "./ProductOwner";
import { Role } from "./Role";

export class ScrumMaster extends Role {

    constructor() {
        super();
        super.name = "Scrum Master";
    }

    public createSprint(productOwner: Person<ProductOwner>, scrumMaster: Person<ScrumMaster>, leadDeveloper: Person<LeadDeveloper> ): SprintBuilder {
        return new SprintBuilder(productOwner, scrumMaster, leadDeveloper);
    }
}