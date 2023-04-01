console.log("test")

import { SlackNotifier } from "./Observer/SlackNotifier";
import { EmailNotifier } from "./Observer/EmailNotifier";
import { BacklogItem } from "./BackLogItem";
import { SprintBacklogFactory } from "./BackLogFactory/SprintBackLogFactory";
import { PersonFactory } from "./PersonFactory";
import { ProductOwner } from "./Roles/ProductOwner";
import { ScrumMaster } from "./Roles/ScrumMaster";
import { Tester } from "./Roles/Tester";
import { LeadDeveloper } from "./Roles/LeadDeveloper";
import { Repository } from "./Repository";
import { SprintType } from "./Sprint/Type";
import { SprintLogObserver } from "./Observer/SprintLogObserver";
import { Developer } from "./Roles/Developer";
import * as path from 'path';
import { InstallPackagesJob } from "./Jobs/InstallPackagesJob";
import { BuildJob } from "./Jobs/BuildJob";
import { DeployJob } from "./Jobs/DeployJob";
import { TestJob } from "./Jobs/TestJob";
import { FailingJob } from "./Jobs/FailingJob";
import { Thread } from "./Thread/Thread";

// Example usage

// Create a factory for creating Person objects with different roles
const personFactory = new PersonFactory();

// Create some Person objects
const productOwner = personFactory.createPerson(new ProductOwner(), "product-owner");
const scrumMaster = personFactory.createPerson(new ScrumMaster(), "scrum-master");
let tester = personFactory.createPerson(new Tester(), "tester");
const leadDeveloper = personFactory.createPerson(new LeadDeveloper(), "lead-dev");
const developer = personFactory.createPerson(new Developer(), "dev");



// Create some observers to receive notifications
const slackNotifier = new SlackNotifier("my-slack-username");
const emailNotifier = new EmailNotifier("my-email-address@example.com");

// Register the observers with the Person objects
productOwner.addObserver(slackNotifier);
productOwner.addObserver(emailNotifier);
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

const pipelineJobs = [
    new InstallPackagesJob(),
    new BuildJob(),
    // new FailingJob(),
    new TestJob(),
    new DeployJob(),
];

let sprint = scrumMaster.roleActions().createSprint(productOwner, scrumMaster, leadDeveloper)
    .addStartDate(new Date("2023-03-24"))
    .addEndDate(new Date("2023-04-28"))
    .addName("Release: Stable videogame")
    .addMembers([developer, tester])
    .addType(SprintType.Release)
    .addSprintBackLog(new SprintBacklogFactory().create(new Repository("Project", "Master")))
    .addPipelineJobs(pipelineJobs)
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

sprint.finish();

let isApproved = true;
sprint.release(isApproved);


const txtFilePath = path.join(__dirname, '..', 'reviewDocs', 'review.txt');
// sprint.review(txtFilePath);

let bobDev = personFactory.createPerson(new Developer(), "Bob");
let henkDev = personFactory.createPerson(new Developer(), "Henk");
let testerDeZwart = personFactory.createPerson(new Tester(), "M. de Zwart");
let pimLead = personFactory.createPerson(new LeadDeveloper(), "Pim");
let masterMelvin = personFactory.createPerson(new ScrumMaster(), "Melvin");
let gekkeHenkie = personFactory.createPerson(new ScrumMaster(), "Henkie");
let leadDevStijn = personFactory.createPerson(new LeadDeveloper(), "Stijn");
let moPO = personFactory.createPerson(new ProductOwner(), "Mo");

let devopsSprint = masterMelvin.roleActions().createSprint(moPO, masterMelvin, pimLead)
.addEndDate(new Date("2023-04-28"))
.addStartDate(new Date("2023-03-24"))
.addName("Devops project")
.addMembers([bobDev, henkDev, testerDeZwart])
.addType(SprintType.Release)
.addSprintBackLog(new SprintBacklogFactory().create(new Repository("Devops", "Master")))
.build();

let logger = new SprintLogObserver();
devopsSprint.addObserver(logger);

let devopsItems = [
    new BacklogItem("UX design", "Design UX for login", 10),
    new BacklogItem("Fix button location", "Get the button centered", 4),
    new BacklogItem("Password requirements", "Password needs 8 chars", 5),
    new BacklogItem("Fix stackoverflow in main.ts", "Stack overflow help???", 12),
];

devopsItems.forEach(item => {
    devopsSprint.addBacklogItem(item);
});

devopsSprint.start(masterMelvin);

let thread = new Thread(testerDeZwart, devopsItems[2], devopsSprint, "Passwords are not encrypted in DB");
let stijnMsg = thread.postMessage(leadDevStijn, "Are you all stupid?", new Date());
stijnMsg?.replyTo(pimLead, "Thank you for your constructive criticism", new Date());
stijnMsg?.replyTo(leadDevStijn, "you're welcome", new Date());
let henkieMsg = thread.postMessage(gekkeHenkie, "How about you encrypt deez nuts?", new Date());
henkieMsg?.replyTo(masterMelvin, "I'm not sure if this is a joke or not", new Date());
henkieMsg?.replyTo(testerDeZwart, "I'm definitely not gonna test deez nuts, melvin can do that.", new Date());
henkieMsg?.replyTo(masterMelvin, "Oh hell no!", new Date());

thread.getMessages().forEach(msg => {
    let replies = msg.getReplies();
    console.log(msg.getAuthor().getUsername() + ": " + msg.getContent());
    replies.forEach(reply => {
        console.log("\t" + reply.getAuthor().getUsername() + ": " + reply.getContent());
    });
    console.log("========");
});


devopsSprint.changeBacklogItemPosition(testerDeZwart, devopsItems[2], devopsSprint.getTodoList(), devopsSprint.getDoingList());
console.log(devopsSprint.getDoingList().getBacklogItems()[0].getTitle());
devopsSprint.changeBacklogItemPosition(testerDeZwart, devopsItems[2], devopsSprint.getDoingList(), devopsSprint.getReadyForTestingList());
devopsSprint.changeBacklogItemPosition(testerDeZwart, devopsItems[2], devopsSprint.getReadyForTestingList(), devopsSprint.getTestedList());
devopsSprint.changeBacklogItemPosition(pimLead, devopsItems[2], devopsSprint.getTestedList(), devopsSprint.getDoneList());
let msg = thread.postMessage(testerDeZwart, "I'm done testing", new Date());
// should be undefined cause locked
console.log(msg);
