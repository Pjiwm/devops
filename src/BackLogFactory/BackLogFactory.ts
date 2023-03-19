import { BacklogItem } from "../BackLogItem";
import { BacklogList } from "../BackLogList/BackLogList";
import { SprintBacklog } from "../SprintBackLog";

export interface SprintBacklogFactory {
  create(backlogLists: BacklogList[], backlogItems: BacklogItem[]): SprintBacklog;
}