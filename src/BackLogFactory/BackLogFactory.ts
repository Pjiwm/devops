import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { SprintBacklog } from "../SprintBackLog";

export interface SprintBacklogFactory {
  create(backlogLists: ListStategy[], backlogItems: BacklogItem[]): SprintBacklog;
}