import { BacklogItem } from "../src/BackLogItem";
import { LogObserver } from "../src/Observer/LogObserver";
import { PersonFactory } from "../src/PersonFactory";
import { LeadDeveloper } from "../src/Roles/LeadDeveloper";
import { ProductOwner } from "../src/Roles/ProductOwner";
import { ScrumMaster } from "../src/Roles/ScrumMaster";
import { SprintType } from "../src/Sprint/Type";

describe("backlog item", () => {
    let pFactory = new PersonFactory();
    let person = pFactory.createPerson(new ProductOwner(), "product-owner");
    let backlogItem = new BacklogItem("Feature", "Building something", 5);
    let backlogLogger = new LogObserver();

    test("backlog item is created with correct properties", () => {
        backlogItem.setAssignee(person);
        backlogItem.addObserver(backlogLogger);
        backlogItem.notifyObservers("Backlog item created");

        expect(backlogItem.getAssignee()).toBe(person);
        expect(backlogItem.getStoryPoints()).toBe(5);
        expect(backlogItem.getDescription()).toBe("Building something");
        expect(backlogItem.getTitle()).toBe("Feature");

        backlogItem.setStoryPoints(6);
        backlogItem.setTitle("Bug");
        backlogItem.setDescription("Fixing something");

        expect(backlogItem.getStoryPoints()).toBe(6);
        expect(backlogItem.getDescription()).toBe("Fixing something");
        expect(backlogItem.getTitle()).toBe("Bug");
        let person2 = pFactory.createPerson(new ProductOwner(), "product-owner2");

        backlogItem.setAssignee(person2);
        expect(backlogItem.getAssignee()).toBe(person2);
        backlogItem.setAssignee(person);
        backlogItem.removeObserver(backlogLogger);
    });

    test("backlog item can have activities", () => {
        backlogItem.addActivity("Activity 1");
        backlogItem.addActivity("Activity 2");
        backlogItem.addActivity("Activity 3");
        expect(backlogItem.getActivities().length()).toEqual(3);

        backlogItem.setActivity("Activity 2", true);
        let acitivty = backlogItem.getActivities().getActivity("Activity 2");
        let activity2 = backlogItem.getActivities().getActivity("Activity 1");

        expect(acitivty).toEqual(true);
        expect(activity2).toEqual(false);

        backlogItem.getActivities().removeActivity("Activity 2");
        expect(backlogItem.getActivities().length()).toEqual(2);
        let removedAcitivty = backlogItem.getActivities().getActivity("Activity 2");
        expect(removedAcitivty).toEqual(false);
        expect(backlogItem.getId()).toBeDefined();
    });

    test("Assignees can be swapped in sprint", () => {
        let item = new BacklogItem("Feature", "Building something", 5);
        let po = pFactory.createPerson(new ProductOwner(), "product-owner3");
        let scrum = pFactory.createPerson(new ScrumMaster(), "4");
        let lead = pFactory.createPerson(new LeadDeveloper(), "5");
        let srpint = scrum.roleActions().createSprint(po, scrum, lead)
        .addEndDate(new Date(2020, 1, 1))
        .addStartDate(new Date(2020, 1, 1))
        .addMember(pFactory.createPerson(new LeadDeveloper(), "6"))
        .addMembers([pFactory.createPerson(new LeadDeveloper(), "7")])
        .addPipelineJobs([])
        .addType(SprintType.Release)
        .addName("Sprint 1")
        .build();
        srpint.addBacklogItem(item);
        item.setAssignee(lead);
        item.swapAssignee(srpint, scrum);
        expect(item.getAssignee()).toBe(scrum);
    });
});