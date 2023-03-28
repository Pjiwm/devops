import { BacklogList } from "../BackLogList/BackLogList";
import { TodoList } from "../BackLogList/TodoList";
import { Repository } from "../Repository";
import { SprintBacklog } from "../SprintBackLog";

export class SprintBacklogFactory implements SprintBacklogFactory {
    create(extraLists: BacklogList[], repository: Repository): SprintBacklog {
        let lists = new Array<BacklogList>();
        lists.push(new TodoList("Todo"));
        lists.push(new TodoList("Doing"));
        lists.concat(extraLists);
        lists.push(new TodoList("Done"));

        return new SprintBacklog(lists, repository);

    }

}