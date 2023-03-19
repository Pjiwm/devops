import { Observer } from "./Observer";

// Subject interface
export interface Subject {
    addObserver(observer: Observer): void;
    removeObserver(observer: Observer): void;
    notifyObservers(message: string): void;
}