console.log("test")

import { SlackNotifier } from "./Observer/SlackNotifier";
import { EmailNotifier } from "./Observer/EmailNotifier";
import { BacklogItem } from "./BackLogItem";
import { SprintBacklogFactory } from "./BackLogFactory/SprintBackLogFactory";
import { PersonFactory } from "./PersonFactory";
import { ScrumMaster } from "./Roles/ScrumMaster";
import { Tester } from "./Roles/Tester";
import { LeadDeveloper } from "./Roles/LeadDeveloper";
import { Repository } from "./Repository";
import { SprintType } from "./Sprint/Type";
import { SprintLogObserver } from "./Observer/SprintLogObserver";
import { Developer } from "./Roles/Developer";
import { Pipeline } from "./Pipeline";
import { BuildJob } from "./Jobs/BuildJob";
import { DeployJob } from "./Jobs/DeployJob";
import { InstallPackagesJob } from "./Jobs/InstallPackagesJob";
import { TestJob } from "./Jobs/TestJob";

// Example usage

// Create a factory for creating Person objects with different roles
const personFactory = new PersonFactory();

// Create some Person objects
const scrumMaster = personFactory.createPerson(new ScrumMaster(), "scrum-master");
let tester = personFactory.createPerson(new Tester(), "tester");
const leadDeveloper = personFactory.createPerson(new LeadDeveloper(), "lead-dev");
const developer = personFactory.createPerson(new Developer(), "dev");



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
console.log(sprint.getName());

// Testing permissions moving items
let todo = sprint.getTodoList()
let readyTesting = sprint.getReadyForTestingList()
let doing = sprint.getDoingList()
let done = sprint.getDoneList()
let testing = sprint.getTestingList()
let tested = sprint.getTestedList()

let item = todo.getBacklogItems()[0];

console.log("\nDev doet iets naar doing:")
sprint.changeBacklogItemPosition(developer, item, todo, doing);
console.log("\nDoet iets wat niet bestaat:")
sprint.changeBacklogItemPosition(developer, item, todo, doing);
console.log("\nDev doet iets naar ready for testing:")
sprint.changeBacklogItemPosition(developer, item, doing, readyTesting);

console.log("\ndeveloper probeert iets van Testing te doen:")
sprint.changeBacklogItemPosition(developer, item, readyTesting, doing);
sprint.changeBacklogItemPosition(developer, item, readyTesting, done);
sprint.changeBacklogItemPosition(developer, item, readyTesting, todo);

console.log("\nTester stopt iets in testing:")
sprint.changeBacklogItemPosition(tester, item, readyTesting, testing);

console.log("\nTester cancelt test:")
sprint.changeBacklogItemPosition(tester, item, testing, todo);

console.log("\nDeveloper doet iets naar ready for testing:")
sprint.changeBacklogItemPosition(developer, item, doing, readyTesting);
sprint.changeBacklogItemPosition(developer, item, todo, readyTesting);


console.log("\nTester doet is afronden:")
sprint.changeBacklogItemPosition(tester, item, readyTesting, testing);
console.log("Hier fout:")
sprint.changeBacklogItemPosition(tester, item, testing, done);
console.log("Hier goed:")
sprint.changeBacklogItemPosition(tester, item, testing, tested);

console.log("\nDeveloper en tester proberen naar doen te verzetten:")
sprint.changeBacklogItemPosition(developer, item, tested, doing);
sprint.changeBacklogItemPosition(tester, item, tested, doing);

console.log("\nLead developer verplaatst iets:")
sprint.changeBacklogItemPosition(leadDeveloper, item, tested, done);


const pipelineJobs = [
    new InstallPackagesJob(),
    new BuildJob(),
    new TestJob(),
    new DeployJob(),
];

const pipelineJobRunner = new Pipeline();

for (const job of pipelineJobs) {
    job.accept(pipelineJobRunner);
}
