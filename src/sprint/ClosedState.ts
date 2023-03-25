import { BacklogItem } from "../BackLogItem";
import { BacklogList } from "../BackLogList/BackLogList";
import { Sprint } from "./Sprint";
import { State } from "./SprintState";

class ClosedState implements State {
    addBacklogItem(sprint: Sprint, item: BacklogItem): void {
        console.log("Cannot add backlog item to closed sprint.");
    }

    removeBacklogItem(sprint: Sprint, item: BacklogItem): void {
        console.log("Cannot remove backlog item from closed sprint.");
    }

    moveBacklogItem(sprint: Sprint, item: BacklogItem, targetList: BacklogList): void {
        console.log("Cannot move backlog item in closed sprint.");
    }

    closeSprint(sprint: Sprint): void {
        console.log("Sprint is already closed.");
    }

    finishSprint(sprint: Sprint): void {
        console.log("Sprint is already finished.");
    }

    start(sprint: Sprint): void {
        console.log("Cannot start closed sprint.");
    }

    finish(sprint: Sprint): void {
        console.log("Cannot finish closed sprint.");
    }

    changeBacklogItemPosition(sprint: Sprint, item: BacklogItem, sourceList: BacklogList, destinationList: BacklogList): void {
        console.log("Cannot change backlog item position in closed sprint.");
    }
}