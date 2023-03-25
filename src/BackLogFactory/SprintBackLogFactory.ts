import { BacklogItem } from "../BackLogItem";
import { BacklogList } from "../BackLogList/BackLogList";
import { Repository } from "../Repository";
import { SprintBacklog } from "../SprintBackLog";

export class SprintBacklogFactory implements SprintBacklogFactory {
    create(backlogLists: BacklogList[], backlogItems: BacklogItem[], repository: Repository): SprintBacklog {
        let backlog = new SprintBacklog(backlogLists, repository);

        for (let item of backlogItems) {
            backlog.addBacklogItem(item);
        }
        return backlog;
    }
}