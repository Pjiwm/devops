import { nanoid } from 'nanoid';
import { BacklogItem } from '../src/BackLogItem';
import { Observer } from '../src/Observer/Observer';
import { Subject } from '../src/Observer/Subject';
import { Person } from '../src/Person';
import { Role } from '../src/Roles/Role';
import { SprintBacklog } from '../src/SprintBackLog';
import { State } from '../src/Sprint/SprintState';
import { CreatedState } from "../src/Sprint/CreatedState";
import { SprintType } from '../src/Sprint/Type';
import { ScrumMaster } from '../src/Roles/ScrumMaster';
import { SprintProperties } from '../src/Sprint/SprintProperties';
import { ListStategy } from '../src/BackLogList/ListStategy';
import { LeadDeveloper } from '../src/Roles/LeadDeveloper';
import { Tester } from '../src/Roles/Tester';
import { Pipeline } from '../src/Pipeline';
import { ActivatedState } from '../src/Sprint/ActivatedState';
import { Sprint } from '../src/Sprint/Sprint';
import { PersonFactory } from "../src/PersonFactory";
import { SprintBacklogFactory } from "../src/BackLogFactory/SprintBackLogFactory";
import { Repository } from "../src/Repository";
import { ProductOwner } from '../src/Roles/ProductOwner';
import { InstallPackagesJob } from '../src/Jobs/InstallPackagesJob';
import { BuildJob } from '../src/Jobs/BuildJob';
import { DeployJob } from '../src/Jobs/DeployJob';
import { FailingJob } from '../src/Jobs/FailingJob';
import { TestJob } from '../src/Jobs/TestJob';
import { Developer } from '../src/Roles/Developer';
import { FinishedState } from '../src/Sprint/FinishedState';
import { Job } from '../src/Jobs/Job';
import { SprintBuilder } from '../src/Sprint/SprintBuilder';
import { DoingList } from '../src/BackLogList/DoingList';

describe("Release sprint", () => {
  let id: string;
  let productOwner: Person<ProductOwner>
  let scrumMaster: Person<ScrumMaster>;
  let tester: Person<Tester>;
  let leadDeveloper: Person<LeadDeveloper>;
  let developer: Person<Developer>;
  let members: Person<Role>[];
  let backlog: SprintBacklog;
  let startDate: Date;
  let endDate: Date;
  let name: string;
  let type: SprintType;
  let pipeline: Pipeline;
  let sprint: Sprint;
  let pipelineJobs: Job[];

  beforeEach(() => {
    const personFactory = new PersonFactory();
    productOwner = personFactory.createPerson(new ProductOwner(), "product-owner");
    scrumMaster = personFactory.createPerson(new ScrumMaster(), "Scrum Master");
    tester = personFactory.createPerson(new Tester(), "tester");
    leadDeveloper = personFactory.createPerson(new LeadDeveloper(), "Lead Developer");
    developer = personFactory.createPerson(new Developer(), "dev");

    startDate = new Date("2023-03-24");
    endDate = new Date("2023-04-28");

    name = "Sprint 1";
    type = SprintType.Release;
    backlog = new SprintBacklogFactory().create(new Repository("Project", "Master"))

    pipelineJobs = [
      new InstallPackagesJob(),
      new BuildJob(),
      new FailingJob(),
      new TestJob(),
      new DeployJob(),
  ];

    sprint = scrumMaster.roleActions().createSprint(productOwner, scrumMaster, leadDeveloper)
    .addStartDate(startDate)
    .addEndDate(endDate)
    .addName(name)
    .addMembers([developer, tester])
    .addType(type)
    .addSprintBackLog(backlog)
    .addPipelineJobs(pipelineJobs)
    .build();

    id = sprint.getId();
  });

  describe("Created sprint", () => {    
    test("If created sprint is created with correct properties", () => {
      expect(sprint.getScrumMaster()).toBe(scrumMaster);
      expect(sprint.getMembers()).toContain(scrumMaster);
      expect(sprint.getMembers()).toContain(leadDeveloper);
      expect(sprint.getBacklog()).toBe(backlog);
      expect(sprint.getStartDate()).toBe(startDate);
      expect(sprint.getEndDate()).toBe(endDate);
      expect(sprint.getName()).toBe(name);
      expect(sprint.getId()).toBe(id);
      expect(sprint.sprintType).toBe(type);
    });

    // Test for a created sprint that you can't changeBacklogItemPosition in the sprint backlog
    test("Created sprint can't change backlog item position", () => {
      const backlogItem = new BacklogItem("Backlog item 5", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      const todoList = sprint.getTodoList();
      const doingList = sprint.getDoingList();

      sprint.changeBacklogItemPosition(developer, backlogItem, todoList, doingList)
      expect(sprint.getDoingList()).not.toContain(backlogItem);
    });

    // Test for a created sprint that you can only edit the name, start date, end date
    test("Created sprint can be edited", () => {
      const newStartDate = new Date("2023-03-25");
      const newEndDate = new Date("2023-04-29");
      const newName = "Sprint 2";
      sprint.setStartDate(newStartDate);
      sprint.setEndDate(newEndDate);
      sprint.setName(newName);
      expect(sprint.getStartDate()).toBe(newStartDate);
      expect(sprint.getEndDate()).toBe(newEndDate);
      expect(sprint.getName()).toBe(newName);
    });

    // Test in a created sprint that you can add backlog items to the sprint backlog
    test("Created sprint can add backlog items", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      const todoList = sprint.getTodoList();
      expect(todoList.getBacklogItems()).toContain(backlogItem);
    });

    // A created sprint that has a end date that is less than the time right now should be finished
    test("Created sprint that has a end date that is less than the time right now should be finished", () => {
      const newEndDate = new Date("2020-04-29");
      sprint.setEndDate(newEndDate);
      sprint.start(scrumMaster);
      expect(sprint.getState() instanceof FinishedState).toBe(true);
    });

    // Cannot close a sprint that is not started
    test("Cannot close a sprint that is not started", () => {
      sprint.close();
      expect(sprint.getState() instanceof FinishedState).toBe(false);
    });

    // Test for a created sprint that can remove a backlog item from the sprint backlog
    test("Created sprint can remove backlog items", () => {
      const backlogItem = new BacklogItem("Backlog item 10", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.removeBacklogItem(backlogItem);
      const todoList = sprint.getTodoList();
      expect(todoList).not.toContain(backlogItem);
    });

    // Test for a created sprint that it can't start a pipeline
    test("Created sprint can't start a pipeline", () => {
      sprint.release(true);
      expect(sprint.getState() instanceof CreatedState).toBe(true);
    });

    test("sprint can be finished", () => {
      sprint.start(scrumMaster);
      sprint.finish();
      expect(sprint.getState() instanceof FinishedState).toBe(true);
    });
  });

  describe("Activated sprint", () => { 
    // Test for an activated sprint that you can't add backlog items to the sprint backlog
    test("Activated sprint can't add backlog items", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.start(scrumMaster);
      sprint.addBacklogItem(backlogItem);
      const todoList = sprint.getTodoList();
      expect(todoList.getBacklogItems()).not.toContain(backlogItem);
    });

    test("Activated sprint can't set name", () => {
      sprint.start(scrumMaster);
      const newName = "Sprint 2";
      sprint.setName(newName);
      expect(sprint.getName()).not.toBe(newName);
    });

    test("Activated sprint can't set start date", () => {
      sprint.start(scrumMaster);
      const newStartDate = new Date("2023-03-25");
      sprint.setStartDate(newStartDate);
      expect(sprint.getStartDate()).not.toBe(newStartDate);
    });

    test("Activated sprint can't set end date", () => {
      sprint.start(scrumMaster);
      const newEndDate = new Date("2023-04-29");
      sprint.setEndDate(newEndDate);
      expect(sprint.getEndDate()).not.toBe(newEndDate);
    });

    test("Activated sprint can't add backlog item", () => {
      sprint.start(scrumMaster);
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      const todoList = sprint.getTodoList();
      expect(todoList.getBacklogItems()).not.toContain(backlogItem);
    });

    test("Activated sprint can't remove backlog item", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      sprint.removeBacklogItem(backlogItem);
      const todoList = sprint.getTodoList();
      expect(todoList.getBacklogItems()).toContain(backlogItem);
    });

    test("Activated sprint can't start sprint", () => {
      sprint.start(scrumMaster);
      sprint.start(scrumMaster);
      expect(sprint.getState() instanceof ActivatedState).toBe(true);
    });
 
  //  test("Activated sprint can't finish sprint", () => {
  //     sprint.setStartDate(new Date());
  //     sprint.setEndDate(new Date());
  //     sprint.start(scrumMaster);
  //     sprint.finish();
  //     sprint.getState();
  //     expect(sprint.getState() instanceof ActivatedState).toBe(true);
  //   });

    test("Activated sprint can't close sprint", () => {
      sprint.start(scrumMaster);
      sprint.close();
      expect(sprint.getState() instanceof ActivatedState).toBe(true);
    });

    test("Activated sprint can't start pipeline", () => {
      sprint.start(scrumMaster);
      sprint.release(true);
      expect(sprint.getState() instanceof ActivatedState).toBe(true);
    });

    /*
      Write tests for this function in the ActivatedState class so all paths are covered
       moveBackLogItem(sprint: Sprint, person: Person<Role>, item: BacklogItem, source: ListStategy, destination: ListStategy): void {
        const toBeTested = source instanceof ReadyForTestingList;
        const toBeDone = destination instanceof DoneList;
        const toBeCanceled = destination instanceof TodoList;
        const beingTested = source instanceof TestingList;
        const inTested = source instanceof TestedList;
        const toDoing = destination instanceof TodoList;

        if (source.contains(item) === false) {
            sprint.notifyObservers(`${item.getTitle()} is not in the ${source.getName()} list.`);
            return;
        }

        if (source instanceof DoneList) {
            sprint.notifyObservers(`${item.getTitle()} is already in the done list.`);
        }

        if (!sprint.getMembers().includes(person)) {
            sprint.notifyObservers(`${person.getUsername()} is not a member of this sprint.`);
            return;
        }

        if ((toBeTested || beingTested) && !(person.roleActions() instanceof Tester)) {
            let msg = "is not a tester and cannot move a backlog item from the tested list.";
            sprint.notifyObservers(`${person.getUsername()} ${msg}`);
            return;
        }

        if ((inTested || toBeDone) && !(person.roleActions() instanceof LeadDeveloper)) {
            let msg = "is not a lead developer and cannot move a backlog item from the tested list.";
            sprint.notifyObservers(`${person.getUsername()} ${msg}`);
            return;
        }

        if (inTested && toDoing) {
            sprint.notifyObservers(`${item.getTitle()} Items in testeed cannot be moved to todo.`);
            return;
        }


        if (source !== destination) {
            source.removeBacklogItem(item);
            destination.addBacklogItem(item);

            if (toBeCanceled) {
                sprint.getScrumMaster()
                    .notifyObservers(`${person.getUsername()} canceled the test of ${item.getTitle()}
                    assigneed to: ${item.getAssignee()?.getUsername()}`);
            }
        }
    }
    */

    test("Activated sprint can't move backlog item if it's not in the todo list", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      const backlogItem2 = new BacklogItem("Backlog item 2", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem2, doingList, todoList);
      expect(sprint.getTodoList().getBacklogItems()).not.toContain(backlogItem2);
      expect(sprint.getDoingList().getBacklogItems()).not.toContain(backlogItem2);
    });

    test("Activated sprint that a member that is not a member of the sprint can't move backlog item", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      const notIncludedMember = new PersonFactory().createPerson(new Developer(), "Not included member");
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(notIncludedMember, backlogItem, todoList, doingList);
      expect(sprint.getTodoList().getBacklogItems()).toContain(backlogItem);
      expect(sprint.getDoingList().getBacklogItems()).not.toContain(backlogItem);
    });

    test("Activated sprint a developer can't move backlog item from ready for testing to testing", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      let readyForTestingList = sprint.getReadyForTestingList();
      sprint.changeBacklogItemPosition(developer, backlogItem, todoList, doingList);
      doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(developer, backlogItem, doingList, readyForTestingList);
      readyForTestingList = sprint.getReadyForTestingList();
      let testingList = sprint.getTestingList();
      sprint.changeBacklogItemPosition(developer, backlogItem, readyForTestingList, testingList);
      expect(sprint.getReadyForTestingList().getBacklogItems()).toContain(backlogItem);
      expect(sprint.getTestingList().getBacklogItems()).not.toContain(backlogItem);
    });

    // test("Activated sprint only a lead developer can move backlog item from ready for tested to done", () => {
    //   const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
    //   sprint.addBacklogItem(backlogItem);
    //   sprint.start(scrumMaster);
    //   let todoList = sprint.getTodoList();
    //   let doingList = sprint.getDoingList();
    //   let readyForTestingList = sprint.getReadyForTestingList();
    //   sprint.changeBacklogItemPosition(developer, backlogItem, todoList, doingList);
    //   doingList = sprint.getDoingList();
    //   sprint.changeBacklogItemPosition(developer, backlogItem, doingList, readyForTestingList);
    //   readyForTestingList = sprint.getReadyForTestingList();
    //   let testingList = sprint.getTestingList();
    //   sprint.changeBacklogItemPosition(developer, backlogItem, readyForTestingList, testingList);
    //   expect(sprint.getReadyForTestingList().getBacklogItems()).toContain(backlogItem);
    //   expect(sprint.getTestingList().getBacklogItems()).not.toContain(backlogItem);
    // });


    test("Activated sprint can move backlog item from todo to doing", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      expect(sprint.getTodoList().getBacklogItems()).not.toContain(backlogItem);
      expect(sprint.getDoingList().getBacklogItems()).toContain(backlogItem);
    });



  });
});
