import { Observer } from "./Observer/Observer";
import { Subject } from "./Observer/Subject";
import { Role } from "./Roles/Role";

// Class representing a Person
export class Person<T extends Role> implements Subject {
  private role: T;
  private notificationMedia: string[];
  private observers: Observer[] = [];

  constructor(private username: string, role: Role, notificationMedia: string[]) {
    this.role = role as T;
    this.notificationMedia = notificationMedia;
  }

  getUsername(): string {
    return this.username;
  }

  roleActions(): T {
    return this.role;
  }

  getNotificationMedia(): string[] {
    return this.notificationMedia;
  }

  setNotificationMedia(notificationMedia: string[]): void {
    this.notificationMedia = notificationMedia;
  }

  // Notify all observers of a change
  notifyObservers(message: string): void {
    for (const observer of this.observers) {
      observer.update(this, message);
    }
  }

  // Add an observer to the list of observers to notify
  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  // Remove an observer from the list of observers to notify
  removeObserver(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }
}
