import { BacklogItem } from "../BackLogItem";
import { BacklogList } from "../BackLogList/BackLogList";
import { Sprint } from "./Sprint";
import { State } from "./SprintState";

class ClosedState implements State {
    addBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.notifyObservers("Cannot add backlog item to closed sprint.");
    }

    removeBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.notifyObservers("Cannot remove backlog item from closed sprint.");
    }

    moveBacklogItem(sprint: Sprint, item: BacklogItem, targetList: BacklogList): void {
        sprint.notifyObservers("Cannot move backlog item in closed sprint.");
    }

    closeSprint(sprint: Sprint): void {
        sprint.notifyObservers("Cannot close a sprint that is already closed.");
    }

    finishSprint(sprint: Sprint): void {
        sprint.notifyObservers("Cannot finish a sprint that is already closed.");
    }

    start(sprint: Sprint): void {
        sprint.notifyObservers("Cannot start a closed sprint.");
    }

    finish(sprint: Sprint): void {
        sprint.notifyObservers("Cannot finish a closed sprint.");
    }

    changeBacklogItemPosition(sprint: Sprint, item: BacklogItem, sourceList: BacklogList, destinationList: BacklogList): void {
        sprint.notifyObservers("Cannot change backlog item position in closed sprint.");
    }
}