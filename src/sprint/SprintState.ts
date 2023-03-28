import { BacklogItem } from "../BackLogItem";
import { BacklogList } from "../BackLogList/BackLogList";
import { Sprint } from "./Sprint";
import { SprintProperties } from "./SprintProperties";

interface State {
    addBacklogItem(sprint: Sprint, todoList: BacklogList, item: BacklogItem): void;
    removeBacklogItem(sprint: Sprint, item: BacklogItem): void;
    moveBacklogItem(sprint: Sprint, item: BacklogItem, targetList: BacklogList): void;
    setName(sprint: Sprint, props: SprintProperties, name: string): void;
    setStartDate(sprint: Sprint, props: SprintProperties, startDate: Date): void;
    setEndDate(sprint: Sprint, props: SprintProperties, startDate: Date): void;
    closeSprint(sprint: Sprint): void;
    finishSprint(sprint: Sprint, currentDate: Date): void;
    start(sprint: Sprint): void;
    finish(sprint: Sprint): void;
    changeBacklogItemPosition(sprint: Sprint, item: BacklogItem, sourceList: BacklogList, destinationList: BacklogList): void;
}

export { State }