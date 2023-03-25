import { BacklogItem } from "../BackLogItem";
import { BacklogList } from "../BackLogList/BackLogList";
import { Sprint } from "./Sprint";
import { State } from "./SprintState";
import { ActivatedState } from "./ActivatedState";

export class CreatedState implements State {
    moveBacklogItem(sprint: Sprint, item: BacklogItem, targetList: BacklogList): void {
        throw new Error("Method not implemented.");
    }
    closeSprint(sprint: Sprint): void {
        throw new Error("Method not implemented.");
    }
    finishSprint(sprint: Sprint): void {
        throw new Error("Method not implemented.");
    }
    changeBacklogItemPosition(sprint: Sprint, item: BacklogItem, sourceList: BacklogList, destinationList: BacklogList): void {
        throw new Error("Method not implemented.");
    }
    start(sprint: Sprint): void {
        sprint.setState(new ActivatedState());
        sprint.notifyObservers('Sprint started');
    }

    finish(sprint: Sprint): void {
        console.log('Cannot finish a sprint that has not been started yet');
    }

    addBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.getBacklog().add(item);
        sprint.notifyObservers('Backlog item added');
    }

    removeBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.getBacklog().remove(item);
        sprint.notifyObservers('Backlog item removed');
    }

    setName(sprint: Sprint, name: string): void {
        sprint.setName(name);
        sprint.notifyObservers('Sprint name updated');
    }

    setStartDate(sprint: Sprint, startDate: Date): void {
        sprint.setStartDate(startDate);
        sprint.notifyObservers('Sprint start date updated');
    }

    setEndDate(sprint: Sprint, endDate: Date): void {
        sprint.setEndDate(endDate);
        sprint.notifyObservers('Sprint end date updated');
    }
}
