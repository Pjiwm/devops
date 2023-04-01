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

describe("Sprint", () => {
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
    .addSprintBackLog(new SprintBacklogFactory().create(new Repository("Project", "Master")))
    .addPipelineJobs(pipelineJobs)
    .build();
  });

  test("sprint is created with correct properties", () => {
    expect(sprint.getScrumMaster()).toBe(scrumMaster);
    expect(sprint.getMembers()).toContain(scrumMaster);
    expect(sprint.getMembers()).toContain(leadDeveloper);
    expect(sprint.getStartDate()).toBe(startDate);
    expect(sprint.getEndDate()).toBe(endDate);
    expect(sprint.getName()).toBe(name);
  });

  test("sprint can be finished", () => {
    sprint.start(scrumMaster);
    sprint.finish();
    expect(sprint.getState() instanceof FinishedState).toBe(true);
  });

  // add more tests as needed...
});
