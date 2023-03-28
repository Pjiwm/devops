import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { TestList } from "../BackLogList/TestList";
import { TodoList } from "../BackLogList/TodoList";
import { Repository } from "../Repository";
import { SprintBacklog } from "../SprintBackLog";

export class SprintBacklogFactory implements SprintBacklogFactory {

    create(extraLists: ListStategy[], repository: Repository): SprintBacklog {
        let lists = new Array<ListStategy>();
        lists.push(new TodoList("Todo"));
        lists.push(new TodoList("Doing"));
        lists.concat(extraLists);
        lists.push(new TestList("Testing"));
        lists.push(new TodoList("Done"));

        return new SprintBacklog(lists, repository);

    }

}