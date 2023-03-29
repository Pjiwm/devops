console.log("test")

import { SlackNotifier } from "./Observer/SlackNotifier";
import { EmailNotifier } from "./Observer/EmailNotifier";
import { BacklogItem } from "./BackLogItem";
import { DoingList } from "./BackLogList/DoingList";
import { DoneList } from "./BackLogList/DoneList";
import { TodoList } from "./BackLogList/TodoList";
import { SprintBacklogFactory } from "./BackLogFactory/SprintBackLogFactory";
import { PersonFactory } from "./PersonFactory";
import { ScrumMaster } from "./Roles/ScrumMaster";
import { Tester } from "./Roles/Tester";
import { LeadDeveloper } from "./Roles/LeadDeveloper";
import { Repository } from "./Repository";
import { SprintType } from "./sprint/Type";
import { SprintLogObserver } from "./Observer/SprintLogObserver";

// Example usage

// Create a factory for creating Person objects with different roles
const personFactory = new PersonFactory();

// Create some Person objects
const scrumMaster = personFactory.createPerson(new ScrumMaster(), "scrum-master");
let tester = personFactory.createPerson(new Tester(), "tester");
const leadDeveloper = personFactory.createPerson(new LeadDeveloper(), "lead-dev");
const developer = personFactory.createPerson(new LeadDeveloper, "dev");
developer.roleActions().doLeadDevStuff();



// Create some observers to receive notifications
const slackNotifier = new SlackNotifier("my-slack-username");
const emailNotifier = new EmailNotifier("my-email-address@example.com");

// Register the observers with the Person objects
scrumMaster.addObserver(slackNotifier);
scrumMaster.addObserver(emailNotifier);
tester.addObserver(slackNotifier);
tester.addObserver(emailNotifier);
leadDeveloper.addObserver(emailNotifier);
developer.addObserver(slackNotifier);
developer.addObserver(emailNotifier);

// Perform some actions that require notification

// Perform another action that requires notification
// BackLog
let items = [
    new BacklogItem("UX design", "Design UX for login", 10),
    new BacklogItem("Fix button location", "Get the button centered", 4),
    new BacklogItem("Password requirements", "Password needs 8 chars", 5),
    new BacklogItem("Fix stackoverflow in main.ts", "Stack overflow help???", 12),
];

let sprint = scrumMaster.roleActions().createSprint(scrumMaster, leadDeveloper)
    .addStartDate(new Date("2023-03-24"))
    .addEndDate(new Date("2023-04-28"))
    .addName("Release: Stable videogame")
    .addMembers([developer, tester])
    .addType(SprintType.Release)
    .addSprintBackLog(new SprintBacklogFactory().create(new Repository("Project", "Master")))
    .build();


let logObserver = new SprintLogObserver();
sprint.addObserver(logObserver);

// Add backlog items
sprint.addBacklogItem(items[0])


sprint.start(scrumMaster);

sprint.setName("Release: New Stable video game") // Should return error

let sourceList = sprint.getTodoList()
let destinationList = sprint.getReadyForTestingList()
let item = sourceList.getBacklogItems()[0];

sprint.changeBacklogItemPosition(item, sourceList, destinationList)

console.log(sprint.getName());