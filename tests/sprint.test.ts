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
    // test("Created sprint can remove backlog items", () => {
    //   const backlogItem = new BacklogItem("Backlog item 1", "This is a backlog item", 5);
    //   sprint.addBacklogItem(backlogItem);
    //   sprint.removeBacklogItem(backlogItem);
    //   const todoList = sprint.getTodoList();
    //   expect(todoList.getBacklogItems()).not.toContain(backlogItem);
    // });

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

  });

});
