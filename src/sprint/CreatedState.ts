import { BacklogItem } from "../BackLogItem";
import { BacklogList } from "../BackLogList/BackLogList";
import { Sprint } from "./Sprint";
import { State } from "./SprintState";
import { ActivatedState } from "./ActivatedState";

export class CreatedState implements State {
    setName(sprint: Sprint, name: string): string {
        sprint.notifyObservers('Sprint name updated');
        return name;
    }

    setStartDate(sprint: Sprint, startDate: Date): Date {
        sprint.notifyObservers('Sprint start date updated');
        return startDate
    }

    setEndDate(sprint: Sprint, endDate: Date): Date {
        sprint.notifyObservers('Sprint end date updated');
        return endDate
    }
    
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
        sprint.notifyObservers('Cannot finish a sprint that has not been started yet');
    }

    addBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.addBacklogItem(item);
        sprint.notifyObservers('Backlog item added');
    }

    removeBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.addBacklogItem(item);
        sprint.notifyObservers('Backlog item removed');
    }
}
