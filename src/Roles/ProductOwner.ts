import { Role } from "./Role";

export class ProductOwner extends Role {

    constructor() {
        super();
        super.name = "Product Owner";
    }
}