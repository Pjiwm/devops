import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { Sprint } from "./Sprint";
import { SprintProperties } from "./SprintProperties";

interface State {
    addBacklogItem(sprint: Sprint, todoList: ListStategy, item: BacklogItem): void;
    removeBacklogItem(sprint: Sprint, item: BacklogItem): void;
    moveBacklogItem(sprint: Sprint, item: BacklogItem, targetList: ListStategy): void;
    setName(sprint: Sprint, props: SprintProperties, name: string): void;
    setStartDate(sprint: Sprint, props: SprintProperties, startDate: Date): void;
    setEndDate(sprint: Sprint, props: SprintProperties, startDate: Date): void;
    start(sprint: Sprint): void;
    finishSprint(sprint: Sprint): void;
    closeSprint(sprint: Sprint): void;
    changeBacklogItemPosition(sprint: Sprint, item: BacklogItem, sourceList: ListStategy, destinationList: ListStategy): void;
}

export { State }