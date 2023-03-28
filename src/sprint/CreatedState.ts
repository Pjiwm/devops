import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { Sprint } from "./Sprint";
import { State } from "./SprintState";
import { ActivatedState } from "./ActivatedState";
import { SprintProperties } from "./SprintProperties";

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

  closeSprint(sprint: Sprint): void {
        throw new Error("Method not implemented.");
    }

  finishSprint(sprint: Sprint): void {
        throw new Error("Method not implemented.");
    }

  changeBacklogItemPosition(sprint: Sprint, item: BacklogItem, sourceList: ListStategy, destinationList: ListStategy): void {
        throw new Error("Method not implemented.");
    }
    start(sprint: Sprint): void {
        sprint.setState(new ActivatedState());
        sprint.notifyObservers('Sprint started');
    }

    finish(sprint: Sprint): void {
        sprint.notifyObservers('Cannot finish a sprint that has not been started yet');
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
