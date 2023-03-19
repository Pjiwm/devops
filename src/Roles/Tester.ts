import { Role } from "./Role";

export class Tester extends Role {

    constructor() {
        super();
        super.name = "Tester";
    }


    public doTestStuff() {
        console.log("I'm a tester, I do test stuff");
    }
}