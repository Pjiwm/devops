import { BacklogItem } from "../BackLogItem";
import { BacklogList } from "../BackLogList/BackLogList";
import { Sprint } from "./Sprint";
import { State } from "./SprintState";

export class FinishedState implements State {
    addBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.notifyObservers("Cannot add backlog item to a finished sprint.");
    }
    removeBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.notifyObservers("Cannot remove backlog item from a finished sprint.");
    }
    moveBacklogItem(sprint: Sprint, item: BacklogItem, targetList: BacklogList): void {
        sprint.notifyObservers("Cannot move backlog item in a finished sprint.");
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
    changeBacklogItemPosition(sprint: Sprint, item: BacklogItem, sourceList: BacklogList, destinationList: BacklogList): void {
        sprint.notifyObservers("Cannot change backlog item position in a finished sprint.");
    }
}