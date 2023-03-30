import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { Sprint } from "./Sprint";
import { State } from "./SprintState";
import { ActivatedState } from "./ActivatedState";
import { SprintProperties } from "./SprintProperties";
import { FinishedState } from "./FinishedState";
import { Person } from "../Person";
import { Role } from "../Roles/Role";

export class CreatedState implements State {

    moveBackLogItem(sprint: Sprint, person: Person<Role>, item: BacklogItem, source: ListStategy, destination: ListStategy): void {
        sprint.notifyObservers('Cannot move backlog item in a created sprint.');
    }

    setName(sprint: Sprint, props: SprintProperties, name: string): void {
        props.setName(name);
        sprint.notifyObservers('Sprint name updated');
    }

    setStartDate(sprint: Sprint, props: SprintProperties, startDate: Date): void {
        props.setStartDate(startDate);
        sprint.notifyObservers('Sprint start date updated');
    }

    setEndDate(sprint: Sprint, props: SprintProperties, endDate: Date): void {
        props.setEndDate(endDate);
        sprint.notifyObservers('Sprint end date updated');
    }

    startSprint(sprint: Sprint): void {
        if (new Date().getTime() > sprint.getEndDate().getTime()) {
            this.finishSprint(sprint);
        } else {
            sprint.setState(new ActivatedState());
            sprint.notifyObservers('Sprint started');
        }
    }

    finishSprint(sprint: Sprint): void {
        sprint.setState(new FinishedState());
        sprint.notifyObservers(`Sprint end date (${sprint.getEndDate().toLocaleDateString()}) is overdue. The sprint is now set to finshed`);
    }

    closeSprint(sprint: Sprint): void {
        sprint.notifyObservers('Cannot close a sprint that has not been started yet');
    }

    addBacklogItem(sprint: Sprint, todoList: ListStategy, item: BacklogItem): void {
        todoList.addBacklogItem(item);
        sprint.notifyObservers('Backlog item added');
    }

    removeBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.addBacklogItem(item);
        sprint.notifyObservers('Backlog item removed');
    }

    startPipeline(sprint: Sprint): void {
        sprint.notifyObservers("Cannot start pipeline on an created sprint.");
    }
}
