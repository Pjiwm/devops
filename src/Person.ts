import { Subject } from "./Subject";
import { Observer } from "./Observer";

// Define the roles a Person can have
interface Role {
  roleName: string;
  canEdit: boolean;
  canDelete: boolean;
}

class ScrumMaster implements Role {
  roleName = "Scrum Master";
  canEdit = true;
  canDelete = true;
}

class Tester implements Role {
  roleName = "Tester";
  canEdit = false;
  canDelete = false;
}

class LeadDeveloper implements Role {
  roleName = "Lead Developer";
  canEdit = true;
  canDelete = false;
}

class Developer implements Role {
  roleName = "Developer";
  canEdit = true;
  canDelete = false;
}

// Factory class to create Person objects with different roles
class PersonFactory {
  createPerson(roleName: string, username: string, notificationMedia: string[]): Person {
    let role: Role;
    switch (roleName) {
      case "Scrum Master":
        role = new ScrumMaster();
        break;
      case "Tester":
        role = new Tester();
        break;
      case "Lead Developer":
        role = new LeadDeveloper();
        break;
      default:
        role = new Developer();
        break;
    }
    return new Person(username, role, notificationMedia);
  }
}

// Class representing a Person
class Person implements Subject {
  private role: Role;
  private notificationMedia: string[];
  private observers: Observer[] = [];

  constructor(private username: string, role: Role, notificationMedia: string[]) {
    this.role = role;
    this.notificationMedia = notificationMedia;
  }

  getUsername(): string {
    return this.username;
  }

  getRole(): Role {
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
      observer.update(this.username, message);
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

  // Perform an action that requires notification of observers
  doAction(action: string): void {
    // Perform the action...
    console.log(`${this.username} (${this.role.roleName}) ${action}`);

    // Notify observers of the action
    const message = `${this.username} (${this.role.roleName}) ${action}`;
    this.notifyObservers(message);
  }
}

export { Person, PersonFactory, Role };