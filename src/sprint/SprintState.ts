import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { Sprint } from "./Sprint";

interface State {
    addBacklogItem(sprint: Sprint, item: BacklogItem): void;
    removeBacklogItem(sprint: Sprint, item: BacklogItem): void;
    moveBacklogItem(sprint: Sprint, item: BacklogItem, targetList: ListStategy): void;
    setName(sprint: Sprint, name: string): void;
    setStartDate(sprint: Sprint, startDate: Date): void;
    setEndDate(sprint: Sprint, endDate: Date): void;
    closeSprint(sprint: Sprint): void;
    finishSprint(sprint: Sprint, currentDate: Date): void;
    start(sprint: Sprint): void;
    finish(sprint: Sprint): void;
    changeBacklogItemPosition(sprint: Sprint, item: BacklogItem, sourceList: ListStategy, destinationList: ListStategy): void;
}

export { State }