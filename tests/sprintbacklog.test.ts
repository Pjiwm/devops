import { DoingList } from "../src/BackLogList/DoingList";
import { DoneList } from "../src/BackLogList/DoneList";
import { ReadyForTestingList } from "../src/BackLogList/ReadyForTestingList";
import { TestedList } from "../src/BackLogList/TestedList";
import { TestingList } from "../src/BackLogList/TestingList";
import { TodoList } from "../src/BackLogList/TodoList";
import { Branch } from "../src/Branch";
import { LogObserver } from "../src/Observer/LogObserver";
import { Repository } from "../src/Repository";
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

});