import { BacklogItem } from "../BackLogItem";
import { DoneList } from "../BackLogList/DoneList";
import { ListStategy } from "../BackLogList/ListStategy";
import { ReadyForTestingList } from "../BackLogList/ReadyForTestingList";
import { TestedList } from "../BackLogList/TestedList";
import { TestingList } from "../BackLogList/TestingList";
import { TodoList } from "../BackLogList/TodoList";
import { Person } from "../Person";
import { LeadDeveloper } from "../Roles/LeadDeveloper";
import { Role } from "../Roles/Role";
import { Tester } from "../Roles/Tester";
import { FinishedState } from "./FinishedState";
import { Sprint } from "./Sprint";
import { SprintProperties } from "./SprintProperties";
import { State } from "./SprintState";

export class ActivatedState implements State {


    setName(sprint: Sprint, props: SprintProperties, name: string): void {
        sprint.notifyObservers("Cannot set name in an activated sprint.");
    }
    setStartDate(sprint: Sprint, props: SprintProperties, startDate: Date): void {
        sprint.notifyObservers("Cannot set start date in an activated sprint.");
    }
    setEndDate(sprint: Sprint, props: SprintProperties, endDate: Date): void {
        sprint.notifyObservers("Cannot set end date in an activated sprint.");
    }
    addBacklogItem(sprint: Sprint, todoList: ListStategy, item: BacklogItem): void {
        sprint.notifyObservers("Cannot add backlog item in an activated sprint.");
    }

    removeBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.notifyObservers("Cannot remove backlog item in an activated sprint.");
    }

    closeSprint(sprint: Sprint): void {
        sprint.notifyObservers("Cannot close an activated sprint.");
    }

    finishSprint(sprint: Sprint, currentDate: Date): void {
        if (currentDate < sprint.getEndDate()) {
            sprint.notifyObservers("Cannot finish an activated sprint before its end date.");
        }
        sprint.setState(new FinishedState());
    }

    start(sprint: Sprint): void {
        sprint.notifyObservers("Cannot start an already activated sprint.");
    }

    finish(sprint: Sprint): void {
        sprint.notifyObservers("Cannot finish an already activated sprint.");
    }

    moveBackLogItem(sprint: Sprint, person: Person<Role>, item: BacklogItem, source: ListStategy, destination: ListStategy): void {
        const toBeTested = source instanceof ReadyForTestingList;
        const toBeDone = destination instanceof DoneList;
        const toBeCanceled = destination instanceof TodoList;
        const beingTested = source instanceof TestingList;
        const inTested = source instanceof TestedList;
        const toDoing = destination instanceof TodoList;

        if (source.contains(item) === false) {
            sprint.notifyObservers(`${item.getTitle()} is not in the ${source.getName()} list.`);
            return;
        }

        if (source instanceof DoneList) {
            sprint.notifyObservers(`${item.getTitle()} is already in the done list.`);
        }

        if (!sprint.getMembers().includes(person)) {
            sprint.notifyObservers(`${person.getUsername()} is not a member of this sprint.`);
            return;
        }

        if ((toBeTested || beingTested) && !(person.roleActions() instanceof Tester)) {
            let msg = "is not a tester and cannot move a backlog item from the tested list.";
            sprint.notifyObservers(`${person.getUsername()} ${msg}`);
            return;
        }

        if ((inTested || toBeDone) && !(person.roleActions() instanceof LeadDeveloper)) {
            let msg = "is not a lead developer and cannot move a backlog item from the tested list.";
            sprint.notifyObservers(`${person.getUsername()} ${msg}`);
            return;
        }

        if (inTested && toDoing) {
            sprint.notifyObservers(`${item.getTitle()} Items in testeed cannot be moved to todo.`);
            return;
        }


        if (source !== destination) {
            source.removeBacklogItem(item);
            destination.addBacklogItem(item);

            if (toBeCanceled) {
                sprint.getScrumMaster()
                    .notifyObservers(`${person.getUsername()} canceled the test of ${item.getTitle()}
                    assigneed to: ${item.getAssignee()?.getUsername()}`);
            }

        }
    }
}
