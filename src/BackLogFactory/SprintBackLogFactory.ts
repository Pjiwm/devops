import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { TodoList } from "../BackLogList/TodoList";
import { DoingList } from "../BackLogList/DoingList";
import { ReadyForTestingList } from "../BackLogList/ReadyForTestingList";
import { TestingList } from "../BackLogList/TestingList";
import { TestedList } from "../BackLogList/TestedList";
import { DoneList } from "../BackLogList/DoneList";
import { Repository } from "../Repository";
import { SprintBacklog } from "../SprintBackLog";

export class SprintBacklogFactory implements SprintBacklogFactory {

    create(extraLists: ListStategy[], repository: Repository): SprintBacklog {
        let lists = new Array<ListStategy>();
        lists.push(new TodoList("Todo"));
        lists.push(new DoingList("Doing"));
        lists.concat(extraLists);
        lists.push(new ReadyForTestingList("Ready for testing"));
        lists.push(new TestingList("Testing"));
        lists.push(new TestedList("Tested"));
        lists.push(new DoneList("Done"));

        return new SprintBacklog(lists, repository);

    }

}