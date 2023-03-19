import { BacklogItem } from "./BackLogItem";
import { DoingList } from "./BackLogList/DoingList";
import { DoneList } from "./BackLogList/DoneList";
import { TodoList } from "./BackLogList/TodoList";
import { SprintBacklogFactory } from "./BackLogFactory/SprintBackLogFactory";
import { LogObserver } from "./Observer/LogObserver";

let doingList = new DoingList("Doing right now");
let doneList = new DoneList("Done");
let todoList = new TodoList("Todo");
let lists = [doingList, doneList, todoList];
let items = [
    new BacklogItem("UX design", "Design UX for login", 10),
    new BacklogItem("Fix button location", "Get the button centered", 4),
    new BacklogItem("Password requirements", "Password needs 8 chars", 5),
    new BacklogItem("Fix stackoverflow in main.ts", "Stack overflow help???", 12),
];

let factory = new SprintBacklogFactory();
let logger = new LogObserver();
let backlog = factory.create(lists, items);
backlog.addObserver(logger);

backlog.addBacklogItem(new BacklogItem("Add new feature", "Add new feature to the app", 8));
backlog.removeBacklogItemById(items[2].getId());