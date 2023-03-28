import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { Sprint } from "./Sprint";
import { SprintProperties } from "./SprintProperties";

interface State {
    addBacklogItem(sprint: Sprint, todoList: BacklogList, item: BacklogItem): void;
    removeBacklogItem(sprint: Sprint, item: BacklogItem): void;
    moveBacklogItem(sprint: Sprint, item: BacklogItem, targetList: ListStategy): void;
    setName(sprint: Sprint, props: SprintProperties, name: string): void;
    setStartDate(sprint: Sprint, props: SprintProperties, startDate: Date): void;
    setEndDate(sprint: Sprint, props: SprintProperties, startDate: Date): void;
    closeSprint(sprint: Sprint): void;
    finishSprint(sprint: Sprint, currentDate: Date): void;
    start(sprint: Sprint): void;
    finish(sprint: Sprint): void;
    changeBacklogItemPosition(sprint: Sprint, item: BacklogItem, sourceList: ListStategy, destinationList: ListStategy): void;
}

export { State }