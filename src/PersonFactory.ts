import { Person } from "./Person";
import { Developer } from "./Roles/Developer";
import { LeadDeveloper } from "./Roles/LeadDeveloper";
import { Role } from "./Roles/Role";
import { ScrumMaster } from "./Roles/ScrumMaster";
import { Tester } from "./Roles/Tester";

// Factory class to create Person objects with different roles
export class PersonFactory {
    createPerson<T extends Role>(role: T, username: string, notificationMedia: string[]): Person<T> {
        if (role instanceof ScrumMaster) {
            return new Person<T>(username, new ScrumMaster(), notificationMedia);
        } else if (role instanceof Tester) {
            return new Person<T>(username, new Tester(), notificationMedia);
        } else if (role instanceof LeadDeveloper) {
            return new Person<T>(username, new LeadDeveloper(), notificationMedia);
        } else {
            return new Person<T>(username, new Developer(), notificationMedia);
        }
    }
}

// export class PersonFactory {

// }