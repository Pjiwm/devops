import { Subject } from "./Subject";

// Observer interface
export interface Observer {
    update(subject: Subject): void;
}