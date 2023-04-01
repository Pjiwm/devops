import { BacklogItem } from "../src/BackLogItem";
import { DoingList } from "../src/BackLogList/DoingList";
import { DoneList } from "../src/BackLogList/DoneList";
import { ReadyForTestingList } from "../src/BackLogList/ReadyForTestingList";
import { TestedList } from "../src/BackLogList/TestedList";
import { TestingList } from "../src/BackLogList/TestingList";
import { TodoList } from "../src/BackLogList/TodoList";
import { Branch } from "../src/Branch";
import { LogObserver } from "../src/Observer/LogObserver";
import { SlackNotifier } from "../src/Observer/SlackNotifier";
import { PersonFactory } from "../src/PersonFactory";
import { Repository } from "../src/Repository";
import { LeadDeveloper } from "../src/Roles/LeadDeveloper";
import { SprintBacklog } from "../src/SprintBackLog";

describe("Sprint backlog", () => {
    let todoList = new TodoList("Todo");
    let doingList = new DoingList("Doing");
    let readyForTestingList = new ReadyForTestingList("Ready for testing");
    let testingList = new TestingList("Testing");
    let testedList = new TestedList("Tested");
    let doneList = new DoneList("Done");
    let lists = [todoList, doingList, readyForTestingList, testingList, testedList, doneList];

    let repo = new Repository("Gaming", "Master");
    let logger = new LogObserver();
    let sprintBackLog = new SprintBacklog(lists, repo);
    sprintBackLog.addObserver(logger);
    sprintBackLog.notifyObservers("Test message");
    sprintBackLog.removeObserver(logger);

    test("Backlog can give back the default lists correctly", () => {
        expect(sprintBackLog.getTodoList()).toBeInstanceOf(TodoList);
        expect(sprintBackLog.getDoingList()).toBeInstanceOf(DoingList);
        expect(sprintBackLog.getReadyForTesting()).toBeInstanceOf(ReadyForTestingList);
        expect(sprintBackLog.getTestingList()).toBeInstanceOf(TestingList);
        expect(sprintBackLog.getTestedList()).toBeInstanceOf(TestedList);
        expect(sprintBackLog.getDoneList()).toBeInstanceOf(DoneList);
        expect(sprintBackLog.getBacklogLists().length).toEqual(6);
        expect(sprintBackLog.getRepository().getName()).toEqual("Gaming");
        expect(sprintBackLog.getId().length).toBeGreaterThanOrEqual(5);
    });

    test("Backlog can have repository with branches", () => {
        repo.addBranch("feature/controls");
        repo.addBranch("feature/graphics");
        repo.addBranch("feature/sound");

        repo.getMasterBranch().addCommit("Initial commit");
        repo.getBranches()[1].addCommit("Added controls");
        expect(repo.getBranches().length).toEqual(4);

        repo.deleteBranch("feature/graphics");
        expect(repo.getBranches().length).toEqual(3);
        expect(repo.getBranch("feature/controls")?.getName()).toEqual("feature/controls");
        expect(repo.getBranch("feature/graphics")).toBeUndefined();

        expect(repo.getBranch("feature/controls")?.getCurrentCommit()).toEqual("Added controls");
        repo.getBranch("feature/controls")?.addCommit("Added more controls");
        repo.getBranch("feature/controls")?.addCommit("Added more controls");
        repo.getBranch("feature/controls")?.addCommit("Added more controls");
        expect(repo.getBranch("feature/controls")?.getCommits().length).toEqual(4);

        repo.deleteBranch("feature/NON_EXISTING");
        expect(repo.getBranches().length).toEqual(3);
    });

    test("Only a ListStrategy of the type ReadyForTestingList can add a person", () => {
        let slack = new SlackNotifier("JohnDoe");
        let person = new PersonFactory().createPerson(new LeadDeveloper(), "John");
        person.addObserver(slack);
        todoList.addPerson(person);
        doingList.addPerson(person);
        readyForTestingList.addPerson(person);
        testingList.addPerson(person);
        testedList.addPerson(person);
        doneList.addPerson(person);
        expect(readyForTestingList.getTesters().length).toEqual(1);
    });

    test("Removing backlog item from various ListStrategies", () => {
        let item = new BacklogItem("Fix stuff", "We need to fix stuff", 3);
        todoList.addBacklogItem(item);
        doingList.addBacklogItem(item);
        readyForTestingList.addBacklogItem(item);
        testingList.addBacklogItem(item);
        testedList.addBacklogItem(item);
        doneList.addBacklogItem(item);

        expect(todoList.getBacklogItems().length).toEqual(1);
        expect(doingList.getBacklogItems().length).toEqual(1);
        expect(readyForTestingList.getBacklogItems().length).toEqual(1);
        expect(testingList.getBacklogItems().length).toEqual(1);
        expect(testedList.getBacklogItems().length).toEqual(1);

        todoList.removeBacklogItem(item);
        doingList.removeBacklogItem(item);
        readyForTestingList.removeBacklogItem(item);
        testingList.removeBacklogItem(item);
        testedList.removeBacklogItem(item);
        doneList.removeBacklogItem(item);

        expect(todoList.contains(item)).toBeFalsy();
        expect(doingList.contains(item)).toBeFalsy();
        expect(readyForTestingList.contains(item)).toBeFalsy();
        expect(testingList.contains(item)).toBeFalsy();
        expect(testedList.contains(item)).toBeFalsy();
        expect(doneList.contains(item)).toBeFalsy();
    });

});