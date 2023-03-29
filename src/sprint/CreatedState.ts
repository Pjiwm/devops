import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { Sprint } from "./Sprint";
import { State } from "./SprintState";
import { ActivatedState } from "./ActivatedState";
import { SprintProperties } from "./SprintProperties";
import { FinishedState } from "./FinishedState";

export class CreatedState implements State {
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

    moveBacklogItem(sprint: Sprint, item: BacklogItem, targetList: ListStategy): void {
        throw new Error("Method not implemented.");
    }

    start(sprint: Sprint): void {
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
        throw new Error("Method not implemented.");
    }

    changeBacklogItemPosition(sprint: Sprint, item: BacklogItem, sourceList: ListStategy, destinationList: ListStategy): void {
        throw new Error("Method not implemented.");
    }

    addBacklogItem(sprint: Sprint, todoList: ListStategy, item: BacklogItem): void {
        todoList.addBacklogItem(item);
        sprint.notifyObservers('Backlog item added');
    }

    removeBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.addBacklogItem(item);
        sprint.notifyObservers('Backlog item removed');
    }
}
