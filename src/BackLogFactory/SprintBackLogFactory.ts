import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { Repository } from "../Repository";
import { SprintBacklog } from "../SprintBackLog";

export class SprintBacklogFactory implements SprintBacklogFactory {
    create(backlogLists: ListStategy[], backlogItems: BacklogItem[], repository: Repository): SprintBacklog {
        let backlog = new SprintBacklog(backlogLists, repository);

        for (let item of backlogItems) {
            backlog.addBacklogItem(item);
        }
        return backlog;
    }
}