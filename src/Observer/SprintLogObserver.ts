import { Sprint } from "../sprint/Sprint";
import { Observer } from "./Observer";
import { Subject } from "./Subject";

export class SprintLogObserver implements Observer {
    update(subject: Subject, message: string): void {
        if (subject instanceof Sprint) {
            console.log(`Sprint [${subject.getId()}] ${subject.getName()}: ${message}`);
        }

    }
}