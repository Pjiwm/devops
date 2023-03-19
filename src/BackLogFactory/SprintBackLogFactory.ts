import { BacklogItem } from "../BackLogItem";
import { BacklogList } from "../BackLogList/BackLogList";
import { SprintBacklog } from "../SprintBackLog";

export class SprintBacklogFactory implements SprintBacklogFactory {
    create(backlogLists: BacklogList[], backlogItems: BacklogItem[]): SprintBacklog {
        let backlog = new SprintBacklog(backlogLists);

        for (let item of backlogItems) {
            backlog.addBacklogItem(item);
        }
        return backlog;
    }
}