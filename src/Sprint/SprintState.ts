import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { Person } from "../Person";
import { Role } from "../Roles/Role";
import { Sprint } from "./Sprint";
import { SprintProperties } from "./SprintProperties";

interface State {
    addBacklogItem(sprint: Sprint, todoList: ListStategy, item: BacklogItem): void;
    removeBacklogItem(sprint: Sprint, item: BacklogItem): void;
    setName(sprint: Sprint, props: SprintProperties, name: string): void;
    setStartDate(sprint: Sprint, props: SprintProperties, startDate: Date): void;
    setEndDate(sprint: Sprint, props: SprintProperties, startDate: Date): void;
    startSprint(sprint: Sprint): void;
    finishSprint(sprint: Sprint): void;
    closeSprint(sprint: Sprint): void;
    moveBackLogItem(sprint: Sprint, person: Person<Role>, item: BacklogItem, source: ListStategy, destination: ListStategy): void;
}

export { State }