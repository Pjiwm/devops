import { BacklogItem } from "../BackLogItem";
import { BacklogList } from "../BackLogList/BackLogList";
import { Sprint } from "./Sprint";
import { State } from "./SprintState";

export class FinishedState implements State {
    addBacklogItem(sprint: Sprint, item: BacklogItem): void {
        console.log("Cannot add backlog item to a finished sprint.");
    }
    removeBacklogItem(sprint: Sprint, item: BacklogItem): void {
        console.log("Cannot remove backlog item from a finished sprint.");
    }
    moveBacklogItem(sprint: Sprint, item: BacklogItem, targetList: BacklogList): void {
        console.log("Cannot move backlog item in a finished sprint.");
    }
    closeSprint(sprint: Sprint): void {
        console.log("Cannot close a sprint that is already finished.");
    }
    finishSprint(sprint: Sprint): void {
        console.log("Sprint is already finished.");
    }
    start(sprint: Sprint): void {
        console.log("Cannot start a sprint that is already finished.");
    }
    finish(sprint: Sprint): void {
        console.log("Cannot finish a sprint that is already finished.");
    }
    changeBacklogItemPosition(sprint: Sprint, item: BacklogItem, sourceList: BacklogList, destinationList: BacklogList): void {
        console.log("Cannot change backlog item position in a finished sprint.");
    }
}