import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { Person } from "../Person";
import { Role } from "../Roles/Role";
import { Sprint } from "./Sprint";
import { SprintProperties } from "./SprintProperties";
import { State } from "./SprintState";

export class FinishedState implements State {

    moveBackLogItem(sprint: Sprint, person: Person<Role>, item: BacklogItem, source: ListStategy, destination: ListStategy): void {
        sprint.notifyObservers("Cannot move backlog item in a finished sprint.");
    }
    setName(sprint: Sprint, props: SprintProperties, name: string): void {
        sprint.notifyObservers("Cannot set name in a finshed sprint.");
    }

    setStartDate(sprint: Sprint, props: SprintProperties, startDate: Date): void {
        sprint.notifyObservers("Cannot set start date in a finshed sprint.");
    }

    setEndDate(sprint: Sprint, props: SprintProperties, endDate: Date): void {
        sprint.notifyObservers("Cannot set end date in a finshed sprint.");;
    }

    addBacklogItem(sprint: Sprint, todoList: ListStategy, item: BacklogItem): void {
        sprint.notifyObservers("Cannot add backlog item to a finished sprint.");
    }

    removeBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.notifyObservers("Cannot remove backlog item from a finished sprint.");
    }


    closeSprint(sprint: Sprint): void {
        sprint.notifyObservers("Cannot close a sprint that is already finished.");
    }

    finishSprint(sprint: Sprint): void {
        sprint.notifyObservers("Cannot finish a sprint that is already finished.");
    }

    start(sprint: Sprint): void {
        sprint.notifyObservers("Cannot start a sprint that is already finished.");
    }

    finish(sprint: Sprint): void {
        sprint.notifyObservers("Cannot finish a sprint that is already finished.");
    }

}