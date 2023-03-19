console.log("test")

import { PersonFactory } from "./Person";
import { SlackNotifier } from "./Notifiers/SlackNotifier";
import { EmailNotifier } from "./Notifiers/EmailNotifier";
import { BacklogItem } from "./BackLogItem";
import { DoingList } from "./BackLogList/DoingList";
import { DoneList } from "./BackLogList/DoneList";
import { TodoList } from "./BackLogList/TodoList";
import { SprintBacklogFactory } from "./BackLogFactory/SprintBackLogFactory";
import { LogObserver } from "./Observer/LogObserver";

// Example usage

// Create a factory for creating Person objects with different roles
const personFactory = new PersonFactory();

// Create some Person objects
const scrumMaster = personFactory.createPerson("Scrum Master", "scrum-master", ["slack", "email"]);
const tester = personFactory.createPerson("Tester", "tester", ["slack"]);
const leadDeveloper = personFactory.createPerson("Lead Developer", "lead-dev", ["email"]);
const developer = personFactory.createPerson("Developer", "dev", ["slack", "email"]);

// Create some observers to receive notifications
const slackNotifier = new SlackNotifier("my-slack-username");
const emailNotifier = new EmailNotifier("my-email-address@example.com");

// Register the observers with the Person objects
scrumMaster.addObserver(slackNotifier);
scrumMaster.addObserver(emailNotifier);
tester.addObserver(slackNotifier);
leadDeveloper.addObserver(emailNotifier);
developer.addObserver(slackNotifier);
developer.addObserver(emailNotifier);

// Perform some actions that require notification
scrumMaster.doAction("created a new user story");
tester.doAction("reported a bug");
leadDeveloper.doAction("approved a pull request");
developer.doAction("committed changes");

// Change the notification media for a Person
developer.setNotificationMedia(["email"]);

// Perform another action that requires notification
developer.doAction("requested a code review");
// BackLog
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
