import { Observer } from "./Observer";

// Subject interface for the Observer design pattern
interface Subject {
  addObserver(observer: Observer): void;
  removeObserver(observer: Observer): void;
  notifyObservers(message: string): void;
}

export { Subject };