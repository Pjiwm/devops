import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { ReadyForTestingList } from "../BackLogList/ReadyForTestingList";
import { Tester } from "../Roles/Tester";
import { FinishedState } from "./FinishedState";
import { Sprint } from "./Sprint";
import { SprintProperties } from "./SprintProperties";
import { State } from "./SprintState";

export class ActivatedState implements State {

    setName(sprint: Sprint, props: SprintProperties, name: string): void {
        sprint.notifyObservers("Cannot set name in an activated sprint.");
    }
    setStartDate(sprint: Sprint, props: SprintProperties, startDate: Date): void {
        sprint.notifyObservers("Cannot set start date in an activated sprint.");
    }
    setEndDate(sprint: Sprint, props: SprintProperties, endDate: Date): void {
        sprint.notifyObservers("Cannot set end date in an activated sprint.");
    }
    addBacklogItem(sprint: Sprint, todoList: ListStategy,  item: BacklogItem): void {
        sprint.notifyObservers("Cannot add backlog item in an activated sprint.");
    }

    removeBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.notifyObservers("Cannot remove backlog item in an activated sprint.");
    }

    moveBacklogItem(sprint: Sprint, item: BacklogItem, targetList: ListStategy): void {
        if (targetList !== sprint.getTodoList()) {
            sprint.notifyObservers("Cannot move backlog items from/to the Todo list in an activated sprint.");
        }
        const sourceList = sprint.findBacklogList(item);
        if (sourceList !== targetList) {
            sourceList?.removeBacklogItem(item);
            targetList.addBacklogItem(item);
        }
    }

    closeSprint(sprint: Sprint): void {
        sprint.notifyObservers("Cannot close an activated sprint.");
    }

    finishSprint(sprint: Sprint, currentDate: Date): void {
        if (currentDate < sprint.getEndDate()) {
            sprint.notifyObservers("Cannot finish an activated sprint before its end date.");
        }
        sprint.setState(new FinishedState());
    }

    start(sprint: Sprint): void {
        sprint.notifyObservers("Cannot start an already activated sprint.");
    }

    finish(sprint: Sprint): void {
        sprint.notifyObservers("Cannot finish an already activated sprint.");
    }

    changeBacklogItemPosition(sprint: Sprint, item: BacklogItem, sourceList: ListStategy, destinationList: ListStategy): void {
        if (sourceList !== destinationList) {
            sourceList.removeBacklogItem(item);
            destinationList.addBacklogItem(item);
        }
    }
}
