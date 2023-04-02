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
import { ClosedState } from '../src/Sprint/ClosedState';
import { CanceledState } from '../src/Sprint/CanceledState';

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

    test("Sprint can only bes started by scrum master", () => {
      sprint.start(developer);
      expect(sprint.getState() instanceof CreatedState).toBe(true);
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

    test("Activated sprint released is canceled", () => {
      sprint.start(scrumMaster);
      sprint.release(false);
      expect(sprint.getState() instanceof CanceledState).toBe(true);
    });

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

    test("Activated sprint only a lead developer can move backlog item from ready for tested to done", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);

      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      let readyForTestingList = sprint.getReadyForTestingList();
      sprint.changeBacklogItemPosition(developer, backlogItem, todoList, doingList);
      
      doingList = sprint.getDoingList();
      let testedList = sprint.getTestedList()
      sprint.changeBacklogItemPosition(tester, backlogItem, doingList, testedList);
      
      readyForTestingList = sprint.getReadyForTestingList();
      let doneList = sprint.getDoneList();
      testedList = sprint.getTestedList();
      sprint.changeBacklogItemPosition(developer, backlogItem, testedList, doneList);
      expect(sprint.getTestedList().getBacklogItems()).toContain(backlogItem);
      expect(sprint.getDoneList().getBacklogItems()).not.toContain(backlogItem);
      
      testedList = sprint.getTestedList();
      doneList = sprint.getDoneList();
      sprint.changeBacklogItemPosition(leadDeveloper, backlogItem, testedList, doneList);
      expect(sprint.getDoneList().getBacklogItems()).toContain(backlogItem);
      expect(sprint.getTestedList().getBacklogItems()).not.toContain(backlogItem);
    });


    test("Activated sprint can't move backlog item from in testing to to doing", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      let readyForTestingList = sprint.getReadyForTestingList();
      sprint.changeBacklogItemPosition(developer, backlogItem, todoList, doingList);

      doingList = sprint.getDoingList();
      let testedList = sprint.getTestedList()
      sprint.changeBacklogItemPosition(tester, backlogItem, doingList, testedList); 

      doingList = sprint.getDoingList();
      testedList = sprint.getTestedList();
      sprint.changeBacklogItemPosition(tester, backlogItem, testedList, doingList);

      expect(sprint.getTestedList().getBacklogItems()).toContain(backlogItem);
      expect(sprint.getDoingList().getBacklogItems()).not.toContain(backlogItem);
    });

    test("Activated sprint can't move backlog item from in done to done", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      let readyForTestingList = sprint.getReadyForTestingList();
      sprint.changeBacklogItemPosition(developer, backlogItem, todoList, doingList);

      doingList = sprint.getDoingList();
      let testedList = sprint.getTestedList()
      sprint.changeBacklogItemPosition(tester, backlogItem, doingList, testedList); 

      let doneList = sprint.getDoneList();
      testedList = sprint.getTestedList();
      sprint.changeBacklogItemPosition(leadDeveloper, backlogItem, testedList, doneList);

      doneList = sprint.getDoneList();
      sprint.changeBacklogItemPosition(leadDeveloper, backlogItem, doneList, doneList);

      expect(sprint.getDoneList().getBacklogItems()).toContain(backlogItem);
    });


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

  describe("Finished sprint", () => {
    test("Finsihed sprint can't move backlog items", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      let readyForTestingList = sprint.getReadyForTestingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, doingList, readyForTestingList);
      expect(sprint.getDoingList().getBacklogItems()).toContain(backlogItem);
      expect(sprint.getReadyForTestingList().getBacklogItems()).not.toContain(backlogItem);
    });

    test("Finsihed sprint can't set name", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      sprint.setName("New name");
      expect(sprint.getName()).not.toBe("New name");
    });

    test("Finsihed sprint can't set start date", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      sprint.setStartDate(new Date());
      expect(sprint.getStartDate()).not.toBe(new Date());
    });

    test("Finsihed sprint can't set end date", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      sprint.setEndDate(new Date());
      expect(sprint.getEndDate()).not.toBe(new Date());
    });

    test("Finsihed sprint can't add backlog item", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      sprint.addBacklogItem(backlogItem);
      expect(sprint.getTodoList().getBacklogItems()).not.toContain(backlogItem);
    });

    test("Finsihed sprint can't remove backlog item", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      sprint.removeBacklogItem(backlogItem);
      expect(sprint.getDoingList().getBacklogItems()).toContain(backlogItem);
    });
    
    test("Finsihed sprint can't start sprint", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      sprint.start(scrumMaster);
      expect(sprint.getStartDate()).not.toBe(new Date());
    });

    test("Finsihed sprint can't finish sprint", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      sprint.finish();
      expect(sprint.getEndDate()).not.toBe(new Date());
    });

    test("Finsihed sprint can close sprint", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      sprint.close();
      expect(sprint.getState() instanceof ClosedState).toBe(true);
    });

    test("Finished sprint can start pipeline", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      sprint.startPipeline();
      expect(sprint.getState() instanceof ClosedState).toBe(true);
    });

    test("Finished sprint pipeline can fail whne a job fails", () => {
      const personFactory = new PersonFactory();
      productOwner = personFactory.createPerson(new ProductOwner(), "product-owner");
      scrumMaster = personFactory.createPerson(new ScrumMaster(), "Scrum Master");
      tester = personFactory.createPerson(new Tester(), "tester");
      leadDeveloper = personFactory.createPerson(new LeadDeveloper(), "Lead Developer");
      developer = personFactory.createPerson(new Developer(), "dev");

      startDate = new Date("2023-03-24");
      endDate = new Date("2023-04-28");

      name = "Sprint 2";
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

      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);

      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      sprint.startPipeline();
      expect(sprint.getState() instanceof FinishedState).toBe(true);
    });
   });

   describe("ClosedState", () => {
     test("Closed sprint cannot move backlog item", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      sprint.close();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, doingList, todoList);
      expect(sprint.getState() instanceof ClosedState).toBe(true);
     });

     test("Closed sprint cannot set name", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      sprint.close();
      sprint.setName("New name");
      expect(sprint.getState() instanceof ClosedState).toBe(true);
     });

      test("Closed sprint cannot set start date", () => {
        const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
        sprint.addBacklogItem(backlogItem);
        sprint.start(scrumMaster);
        let todoList = sprint.getTodoList();
        let doingList = sprint.getDoingList();
        sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
        sprint.finish();
        sprint.close();
        sprint.setStartDate(new Date("2023-03-24"));
        expect(sprint.getState() instanceof ClosedState).toBe(true);
      });

      test("Closed sprint cannot set end date", () => {
        const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
        sprint.addBacklogItem(backlogItem);
        sprint.start(scrumMaster);
        let todoList = sprint.getTodoList();
        let doingList = sprint.getDoingList();
        sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
        sprint.finish();
        sprint.close();
        sprint.setEndDate(new Date("2023-04-28"));
        expect(sprint.getState() instanceof ClosedState).toBe(true);
      });

      test("Closed sprint cannot add backlog item", () => {
        const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
        sprint.addBacklogItem(backlogItem);
        sprint.start(scrumMaster);
        let todoList = sprint.getTodoList();
        let doingList = sprint.getDoingList();
        sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
        sprint.finish();
        sprint.close();
        sprint.addBacklogItem(new BacklogItem("Backlog item 2", "This is a backlog item", 5));
        expect(sprint.getState() instanceof ClosedState).toBe(true);
      });

      test("Closed sprint cannot remove backlog item", () => {
        const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
        sprint.addBacklogItem(backlogItem);
        sprint.start(scrumMaster);
        let todoList = sprint.getTodoList();
        let doingList = sprint.getDoingList();
        sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
        sprint.finish();
        sprint.close();
        sprint.removeBacklogItem(backlogItem);
        expect(sprint.getState() instanceof ClosedState).toBe(true);
      });

      test("Closed sprint cannot start sprint", () => {
        const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
        sprint.addBacklogItem(backlogItem);
        sprint.start(scrumMaster);
        let todoList = sprint.getTodoList();
        let doingList = sprint.getDoingList();
        sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
        sprint.finish();
        sprint.close();
        sprint.start(scrumMaster);
        expect(sprint.getState() instanceof ClosedState).toBe(true);
      });

      test("Closed sprint cannot finish sprint", () => {
        const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
        sprint.addBacklogItem(backlogItem);
        sprint.start(scrumMaster);
        let todoList = sprint.getTodoList();
        let doingList = sprint.getDoingList();
        sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
        sprint.finish();
        sprint.close();
        sprint.finish();
        expect(sprint.getState() instanceof ClosedState).toBe(true);
      });

      test("Closed sprint cannot close sprint", () => {
        const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
        sprint.addBacklogItem(backlogItem);
        sprint.start(scrumMaster);
        let todoList = sprint.getTodoList();
        let doingList = sprint.getDoingList();
        sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
        sprint.finish();
        sprint.close();
        sprint.close();
        expect(sprint.getState() instanceof ClosedState).toBe(true);
      });

      test("Closed sprint cannot start pipeline", () => {
        const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
        sprint.addBacklogItem(backlogItem);
        sprint.start(scrumMaster);
        let todoList = sprint.getTodoList();
        let doingList = sprint.getDoingList();
        sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
        sprint.finish();
        sprint.close();
        sprint.startPipeline();
        expect(sprint.getState() instanceof ClosedState).toBe(true);
      });

      test("Closed sprint generate report", () => {
        const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
        const backlogItemTwo = new BacklogItem("Backlog item 2", "This is a backlog item 2", 10);
        sprint.addBacklogItem(backlogItem);
        sprint.addBacklogItem(backlogItemTwo);

        backlogItem.setAssignee(developer);
        backlogItemTwo.setAssignee(tester);

        sprint.start(scrumMaster);

        sprint.changeBacklogItemPosition(developer, backlogItem, sprint.getTodoList(), sprint.getDoingList());
        sprint.changeBacklogItemPosition(developer, backlogItemTwo, sprint.getTodoList(), sprint.getDoingList());

        sprint.changeBacklogItemPosition(tester, backlogItem, sprint.getDoingList(), sprint.getReadyForTestingList());
        sprint.changeBacklogItemPosition(tester, backlogItemTwo, sprint.getDoingList(), sprint.getReadyForTestingList());

        sprint.changeBacklogItemPosition(tester, backlogItem, sprint.getReadyForTestingList(), sprint.getTestingList());
        sprint.changeBacklogItemPosition(tester, backlogItemTwo, sprint.getReadyForTestingList(), sprint.getTestingList());

        sprint.changeBacklogItemPosition(tester, backlogItem, sprint.getTestingList(), sprint.getTestedList());
        sprint.changeBacklogItemPosition(tester, backlogItemTwo, sprint.getTestingList(), sprint.getTestedList());

        sprint.changeBacklogItemPosition(leadDeveloper, backlogItem, sprint.getTestedList(), sprint.getDoneList());
        sprint.changeBacklogItemPosition(leadDeveloper, backlogItemTwo, sprint.getTestedList(), sprint.getDoneList());

        let todoList = sprint.getTodoList();
        let doneList = sprint.getDoneList();
        sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doneList);
        sprint.finish();
        sprint.close();
        let report = sprint.generateSprintReport("HeaderReport", "FooterReport");
        console.log(report);
        // Expect report to contain burndown chart total of 15
        expect(report).toContain("15");
        expect(report).toContain("HeaderReport");
        expect(report).toContain("FooterReport");
        expect(report).toContain("FooterReport");
        
        expect(sprint.getState() instanceof ClosedState).toBe(true);
      });
   });

   describe("Canceld state", () => {
    test("Canceled sprint cannot move backlog item", () => {
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      sprint.cancelRelease();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, doingList, todoList);
      expect(sprint.getState() instanceof CanceledState).toBe(true);
    });

    test("Canceled sprint cannot set name", () => {
      sprint.start(scrumMaster);
      sprint.finish();
      sprint.cancelRelease();
      sprint.setName("New name");
      expect(sprint.getState() instanceof CanceledState).toBe(true);
    });

    test("Canceled sprint cannot set start date", () => {
      sprint.start(scrumMaster);
      sprint.finish();
      sprint.cancelRelease();
      sprint.setStartDate(new Date());
      expect(sprint.getState() instanceof CanceledState).toBe(true);
    });

    test("Canceled sprint cannot set end date", () => {
      sprint.start(scrumMaster);
      sprint.finish();
      sprint.cancelRelease();
      sprint.setEndDate(new Date());
      expect(sprint.getState() instanceof CanceledState).toBe(true);
    });

    test("Canceled sprint cannot add backlog item", () => {
      sprint.start(scrumMaster);
      sprint.finish();
      sprint.cancelRelease();
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      expect(sprint.getState() instanceof CanceledState).toBe(true);
    });

    test("Canceled sprint cannot remove backlog item", () => {
      sprint.start(scrumMaster);
      sprint.finish();
      sprint.cancelRelease();
      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);
      sprint.removeBacklogItem(backlogItem);
      expect(sprint.getState() instanceof CanceledState).toBe(true);
    });

    test("Canceled sprint cannot start sprint", () => {
      sprint.start(scrumMaster);
      sprint.finish();
      sprint.cancelRelease();
      sprint.start(scrumMaster);
      expect(sprint.getState() instanceof CanceledState).toBe(true);
    });

    test("Canceled sprint cannot finish sprint", () => {
      sprint.start(scrumMaster);
      sprint.finish();
      sprint.cancelRelease();
      sprint.finish();
      expect(sprint.getState() instanceof CanceledState).toBe(true);
    });

    test("Canceled sprint cannot close sprint", () => {
      sprint.start(scrumMaster);
      sprint.finish();
      sprint.cancelRelease();
      sprint.close();
      expect(sprint.getState() instanceof CanceledState).toBe(true);
    });

    test("Canceled sprint pipeline can fail whne a job fails", () => {
      const personFactory = new PersonFactory();
      productOwner = personFactory.createPerson(new ProductOwner(), "product-owner");
      scrumMaster = personFactory.createPerson(new ScrumMaster(), "Scrum Master");
      tester = personFactory.createPerson(new Tester(), "tester");
      leadDeveloper = personFactory.createPerson(new LeadDeveloper(), "Lead Developer");
      developer = personFactory.createPerson(new Developer(), "dev");

      startDate = new Date("2023-03-24");
      endDate = new Date("2023-04-28");

      name = "Sprint 2";
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

      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);

      sprint.start(scrumMaster);
      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      sprint.cancelRelease();
      sprint.startPipeline();
      expect(sprint.getState() instanceof CanceledState).toBe(true);
    });

    test("Canceld sprint can start pipeline and still go to finished state", () => {
      const personFactory = new PersonFactory();
      productOwner = personFactory.createPerson(new ProductOwner(), "product-owner");
      scrumMaster = personFactory.createPerson(new ScrumMaster(), "Scrum Master");
      tester = personFactory.createPerson(new Tester(), "tester");
      leadDeveloper = personFactory.createPerson(new LeadDeveloper(), "Lead Developer");
      developer = personFactory.createPerson(new Developer(), "dev");

      startDate = new Date("2023-03-24");
      endDate = new Date("2023-04-28");

      name = "Sprint 2";
      type = SprintType.Release;
      backlog = new SprintBacklogFactory().create(new Repository("Project", "Master"))

      pipelineJobs = [
        new InstallPackagesJob(),
        new BuildJob(),
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

      const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
      sprint.addBacklogItem(backlogItem);

      sprint.start(scrumMaster);

      let todoList = sprint.getTodoList();
      let doingList = sprint.getDoingList();
      sprint.changeBacklogItemPosition(scrumMaster, backlogItem, todoList, doingList);
      sprint.finish();
      sprint.cancelRelease();
      sprint.startPipeline();
      expect(sprint.getState() instanceof ClosedState).toBe(true);
    });
  });

});
