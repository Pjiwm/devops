import { BacklogItem } from "../BackLogItem";
import { BacklogList } from "../BackLogList/BackLogList";
import { FinishedState } from "./FinishedState";
import { Sprint } from "./Sprint";
import { State } from "./SprintState";


export class ActivatedState implements State {
    addBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.getTodoList().addBacklogItem(item);
    }

    removeBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.getTodoList().removeBacklogItem(item);

    }

    moveBacklogItem(sprint: Sprint, item: BacklogItem, targetList: BacklogList): void {
        if (targetList !== sprint.getTodoList()) {
            throw new Error("Cannot move backlog items from/to the Todo list in an activated sprint.");
        }
        const sourceList = sprint.findBacklogList(item);
        if (sourceList !== targetList) {
            sourceList?.removeBacklogItem(item);
            targetList.addBacklogItem(item);
        }
    }

    closeSprint(sprint: Sprint): void {
        console.log("Cannot close an activated sprint.");
    }

    finishSprint(sprint: Sprint, currentDate: Date): void {
        if (currentDate < sprint.getEndDate()) {
            console.log("Cannot finish an activated sprint before its end date.");
        }
        sprint.setState(new FinishedState());
    }

    start(sprint: Sprint): void {
        console.log("Cannot start an already activated sprint.");
    }

    finish(sprint: Sprint): void {
        console.log("Cannot finish an already activated sprint.");
    }

    changeBacklogItemPosition(sprint: Sprint, item: BacklogItem, sourceList: BacklogList, destinationList: BacklogList): void {
        if (destinationList !== sprint.getTodoList()) {
            throw new Error("Cannot move backlog items from/to the Todo list in an activated sprint.");
        }
        if (sourceList !== destinationList) {
            sourceList.removeBacklogItem(item);
            destinationList.addBacklogItem(item);
        }
    }
}
