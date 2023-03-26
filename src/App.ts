console.log("test")

import { SlackNotifier } from "./Observer/SlackNotifier";
import { EmailNotifier } from "./Observer/EmailNotifier";
import { BacklogItem } from "./BackLogItem";
import { DoingList } from "./BackLogList/DoingList";
import { DoneList } from "./BackLogList/DoneList";
import { TodoList } from "./BackLogList/TodoList";
import { SprintBacklogFactory } from "./BackLogFactory/SprintBackLogFactory";
import { LogObserver } from "./Observer/LogObserver";
import { PersonFactory } from "./PersonFactory";
import { Developer } from "./Roles/Developer";
import { ScrumMaster } from "./Roles/ScrumMaster";
import { Tester } from "./Roles/Tester";
import { LeadDeveloper } from "./Roles/LeadDeveloper";
import { Repository } from "./Repository";
import { Sprint } from "./sprint/Sprint";
import { SprintBacklog } from "./SprintBackLog";
import { SprintType } from "./sprint/Type";
import { SprintLogObserver } from "./Observer/SprintLogObserver";

// Example usage

// Create a factory for creating Person objects with different roles
const personFactory = new PersonFactory();

// Create some Person objects
const scrumMaster = personFactory.createPerson(new ScrumMaster(), "scrum-master", ["slack", "email"]);
const tester = personFactory.createPerson(new Tester(), "tester", ["slack"]);
const leadDeveloper = personFactory.createPerson(new LeadDeveloper(), "lead-dev", ["email"]);
const developer = personFactory.createPerson(new LeadDeveloper, "dev", ["slack", "email"]);
developer.roleActions().doLeadDevStuff();



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

let sprint = scrumMaster.roleActions().createSprint(scrumMaster)
    .addStartDate(new Date("2023-09-01"))
    .addEndDate(new Date("2023-09-21"))
    .addName("Release: Stable videogame")
    .addMembers([developer, leadDeveloper, scrumMaster, tester])
    .addType(SprintType.Release)
    .addSprintBackLog(new SprintBacklogFactory().create(lists, items, new Repository("Project", "Master")))
    .build();

let logObserver = new SprintLogObserver();
sprint.addObserver(logObserver);

sprint.setName("hoi")
sprint.start(scrumMaster);

sprint.addBacklogItem(new BacklogItem("Fix bug", "Fix bug in main.ts", 8));