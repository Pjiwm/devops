import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { Person } from "../Person";
import { Role } from "../Roles/Role";
import { Sprint } from "./Sprint";
import { SprintProperties } from "./SprintProperties";
import { State } from "./SprintState";

export class ClosedState implements State {
    moveBackLogItem(sprint: Sprint, person: Person<Role>, item: BacklogItem, source: ListStategy, destination: ListStategy): void {
        sprint.notifyObservers("Cannot move backlog item in a closed sprint.");
    }

    setName(sprint: Sprint, props: SprintProperties, name: string): void {
        sprint.notifyObservers("Cannot set name in a closed sprint.");
    }

    setStartDate(sprint: Sprint, props: SprintProperties, startDate: Date): void {
        sprint.notifyObservers("Cannot set start date in a closed sprint.");
    }

    setEndDate(sprint: Sprint, props: SprintProperties, endDate: Date): void {
        sprint.notifyObservers("Cannot set end date in a closed sprint.");
    }

    addBacklogItem(sprint: Sprint, todoList: ListStategy, item: BacklogItem): void {
        sprint.notifyObservers("Cannot add backlog item to closed sprint.");
    }

    removeBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.notifyObservers("Cannot remove backlog item from closed sprint.");
    }

    startSprint(sprint: Sprint): void {
        sprint.notifyObservers("Cannot start a closed sprint.");
    }

    finishSprint(sprint: Sprint): void {
        sprint.notifyObservers("Cannot finish a sprint that is already closed.");
    }

    closeSprint(sprint: Sprint): void {
        sprint.notifyObservers("Cannot close a sprint that is already closed.");

    }
}