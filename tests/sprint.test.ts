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

describe("Sprint", () => {
  let scrumMaster: Person<ScrumMaster>;
  let leadDeveloper: Person<LeadDeveloper>;
  let members: Person<Role>[];
  let backlog: SprintBacklog;
  let startDate: Date;
  let endDate: Date;
  let name: string;
  let type: SprintType;
  let pipeline: Pipeline;
  let sprint: Sprint;

  beforeEach(() => {
    const personFactory = new PersonFactory();

    scrumMaster = personFactory.createPerson(new ScrumMaster(), "Scrum Master");
    leadDeveloper = personFactory.createPerson(new LeadDeveloper(), "Lead Developer");
    members = [];
    backlog = new SprintBacklogFactory().create(new Repository("Devops", "Master"));
    startDate = new Date();
    endDate = new Date();
    name = "Sprint 1";
    type = SprintType.Release;
    pipeline = new Pipeline();
    sprint = new Sprint(scrumMaster, leadDeveloper, members, backlog, startDate, endDate, name, type, pipeline);
  });

  test("sprint is created with correct properties", () => {
    expect(sprint.getScrumMaster()).toBe(scrumMaster);
    expect(sprint.getMembers()).toContain(scrumMaster);
    expect(sprint.getMembers()).toContain(leadDeveloper);
    expect(sprint.getBacklog()).toBe(backlog);
    expect(sprint.getStartDate()).toBe(startDate);
    expect(sprint.getEndDate()).toBe(endDate);
    expect(sprint.getName()).toBe(name);
    expect(sprint.getPipeline()).toBe(pipeline);
    expect(sprint.getId()).toBeTruthy();
    expect(sprint.sprintType).toBe(type);
  });

//   test("sprint can be finished", () => {
//     sprint.start(scrumMaster);
//     sprint.finish();
//     expect(sprint.getState() instanceof CreatedState).toBe(true);
//   });

  // add more tests as needed...
});
