import { SprintBacklogFactory } from "../src/BackLogFactory/SprintBackLogFactory";
import { BacklogItem } from "../src/BackLogItem";
import { BuildJob } from "../src/Jobs/BuildJob";
import { DeployJob } from "../src/Jobs/DeployJob";
import { FailingJob } from "../src/Jobs/FailingJob";
import { InstallPackagesJob } from "../src/Jobs/InstallPackagesJob";
import { TestJob } from "../src/Jobs/TestJob";
import { LogObserver } from "../src/Observer/LogObserver";
import { PersonFactory } from "../src/PersonFactory";
import { Repository } from "../src/Repository";
import { Developer } from "../src/Roles/Developer";
import { LeadDeveloper } from "../src/Roles/LeadDeveloper";
import { ProductOwner } from "../src/Roles/ProductOwner";
import { ScrumMaster } from "../src/Roles/ScrumMaster";
import { Tester } from "../src/Roles/Tester";
import { SprintType } from "../src/Sprint/Type";
import { Thread } from "../src/Thread/Thread";
import { EmailNotifier } from "../src/Observer/EmailNotifier";
import { SlackNotifier } from "../src/Observer/SlackNotifier";

describe("Thread", () => {

    const personFactory = new PersonFactory();
    let productOwner = personFactory.createPerson(new ProductOwner(), "product-owner");
    let scrumMaster = personFactory.createPerson(new ScrumMaster(), "Scrum Master");
    let tester = personFactory.createPerson(new Tester(), "tester");
    let leadMail = new EmailNotifier("Lead@gmail.com");
    let leadSlack = new SlackNotifier("LeadSlack");
    let leadDeveloper = personFactory.createPerson(new LeadDeveloper(), "Lead Developer");
    leadDeveloper.addObserver(leadMail);
    leadDeveloper.addObserver(leadSlack);
    leadDeveloper.removeObserver(leadSlack);
    let devMail = new EmailNotifier("dev@gmail.com");
    let developer = personFactory.createPerson(new Developer(), "dev");
    developer.addObserver(devMail);

    let startDate = new Date("2023-03-24");
    let endDate = new Date("2023-04-28");

    let name = "Sprint 1";
    let type = SprintType.Release;

    let pipelineJobs = [
        new InstallPackagesJob(),
        new BuildJob(),
        new FailingJob(),
        new TestJob(),
        new DeployJob(),
    ];

    let sprint = scrumMaster.roleActions().createSprint(productOwner, scrumMaster, leadDeveloper)
        .addStartDate(startDate)
        .addEndDate(endDate)
        .addName(name)
        .addMembers([developer, tester])
        .addType(type)
        .addSprintBackLog(new SprintBacklogFactory().create(new Repository("Project", "Master")))
        .addPipelineJobs(pipelineJobs)
        .build();

    let backlogItem = new BacklogItem("Building something", "Feature", 5);
    sprint.addBacklogItem(backlogItem);
    sprint.start(scrumMaster);

    test("Threads can have messages and replies", () => {

        const thread = new Thread(developer, backlogItem, sprint, "What are we building?");
        thread.postMessage(scrumMaster, "A new feature", new Date());
        thread.postMessage(leadDeveloper, "A new feature", new Date());
        let date = new Date();
        let msg = thread.postMessage(developer, "A new feature", date);
        let replyDate = new Date();
        let reply = msg?.replyTo(scrumMaster, "A reply", replyDate);
        msg?.replyTo(developer, "A reply", new Date());

        expect(thread.getMessages().length).toBe(3);
        expect(thread.getMessages()[2].getReplies().length).toBe(2);
        expect(msg?.getAuthor()).toBe(developer);
        expect(msg?.getDate()).toBe(date);
        expect(msg?.getReplies()[0].getAuthor()).toBe(scrumMaster);
        expect(msg?.getContent()).toBe("A new feature");
        expect(msg?.getDate()).toBe(date);
        expect(thread.getOriginalPoster()).toBe(developer);
        expect(thread.isClosed()).toBe(false);
        expect(reply?.getContent()).toBe("A reply");
        expect(reply?.getDate()).toBe(replyDate);
        expect(thread.getOriginalPoster()).toBe(developer);



    });

    test("Messages cannot be posted on done backlog item", () => {
        sprint.addObserver(new LogObserver())
        let thread2 = new Thread(developer, backlogItem, sprint, "What are we building?");
        let msg = thread2.postMessage(scrumMaster, "A new feature", new Date());
        sprint.changeBacklogItemPosition(developer, backlogItem, sprint.getTodoList(), sprint.getDoingList());
        sprint.changeBacklogItemPosition(developer, backlogItem, sprint.getDoingList(), sprint.getReadyForTestingList());
        sprint.changeBacklogItemPosition(tester, backlogItem, sprint.getReadyForTestingList(), sprint.getTestedList());
        sprint.changeBacklogItemPosition(leadDeveloper, backlogItem, sprint.getTestedList(), sprint.getDoneList());
        let newMsg = thread2.postMessage(developer, "I should not exist.", new Date());
        let newReply = msg?.replyTo(scrumMaster, "I should not exist.", new Date());

        expect(sprint.getDoneList().getBacklogItems().length).toBe(1);
        expect(newMsg).toBe(undefined);
        expect(newReply).toBe(undefined);
        expect(thread2.isClosed()).toBe(true);
    });

});