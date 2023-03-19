import { Observer } from "./Observer";
import { Subject } from "./Subject";

export class LogObserver implements Observer {
    update(subject: Subject): void {
        let time = new Date().toLocaleString();
        console.log(`[${time}]: ${subject}`);
    }
}