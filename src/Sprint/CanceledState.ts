import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { Person } from "../Person";
import { Role } from "../Roles/Role";
import { Sprint } from "./Sprint";
import { SprintProperties } from "./SprintProperties";
import { State } from "./SprintState";
import { FinishedState } from "./FinishedState";

export class CanceledState implements State {

    moveBackLogItem(sprint: Sprint, person: Person<Role>, item: BacklogItem, source: ListStategy, destination: ListStategy): void {
        sprint.notifyObservers("Cannot move backlog item in a canceled sprint.");
    }
    setName(sprint: Sprint, props: SprintProperties, name: string): void {
        sprint.notifyObservers("Cannot set name in a canceled sprint.");
    }

    setStartDate(sprint: Sprint, props: SprintProperties, startDate: Date): void {
        sprint.notifyObservers("Cannot set start date in a canceled sprint.");
    }

    setEndDate(sprint: Sprint, props: SprintProperties, endDate: Date): void {
        sprint.notifyObservers("Cannot set end date in a canceled sprint.");;
    }

    addBacklogItem(sprint: Sprint, todoList: ListStategy, item: BacklogItem): void {
        sprint.notifyObservers("Cannot add backlog item to a canceled sprint.");
    }

    removeBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.notifyObservers("Cannot remove backlog item from a canceled sprint.");
    }

    startSprint(sprint: Sprint): void {
        sprint.notifyObservers("Cannot start a sprint that is canceled.");
    }

    finishSprint(sprint: Sprint): void {
        sprint.notifyObservers("Cannot finish a sprint that is canceled.");
    }

    closeSprint(sprint: Sprint): void {
        sprint.notifyObservers("Cannot close a sprint that is canceled.");
    }

    startPipeline(sprint: Sprint): void {
        const pipelineJobs = sprint.getPipelineJobs();
        const pipelineJobRunner = sprint.getPipeline();

        console.log("Starting pipeline...");

        for (const job of pipelineJobs) {
            console.log(`Executing ${job.constructor.name}`);
            try {
              job.accept(pipelineJobRunner);
            } catch (error) {
              sprint.getScrumMaster().notifyObservers("Pipeline failed with error: " + error);
              console.error("Error running pipeline job:", error);
              return;
            }
          }

        console.log('Pipeline execution complete.');

        sprint.getScrumMaster().notifyObservers(`${sprint.getName()} has been succesfully released`);
        sprint.getProductOwner().notifyObservers(`${sprint.getName()} has been succesfully released`);

        sprint.setState(new FinishedState());
        sprint.close()
    }

}