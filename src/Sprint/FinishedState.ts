import { BacklogItem } from "../BackLogItem";
import { ListStategy } from "../BackLogList/ListStategy";
import { Person } from "../Person";
import { Role } from "../Roles/Role";
import { Sprint } from "./Sprint";
import { SprintProperties } from "./SprintProperties";
import { State } from "./SprintState";
import { ClosedState } from "./ClosedState";
import { CanceledState } from "./CanceledState";
import { Pipeline } from "../Pipeline";
import { BuildJob } from "../Jobs/BuildJob";
import { DeployJob } from "../Jobs/DeployJob";
import { InstallPackagesJob } from "../Jobs/InstallPackagesJob";
import { TestJob } from "../Jobs/TestJob";

export class FinishedState implements State {

    moveBackLogItem(sprint: Sprint, person: Person<Role>, item: BacklogItem, source: ListStategy, destination: ListStategy): void {
        sprint.notifyObservers("Cannot move backlog item in a finished sprint.");
    }
    
    setName(sprint: Sprint, props: SprintProperties, name: string): void {
        sprint.notifyObservers("Cannot set name in a finshed sprint.");
    }

    setStartDate(sprint: Sprint, props: SprintProperties, startDate: Date): void {
        sprint.notifyObservers("Cannot set start date in a finshed sprint.");
    }

    setEndDate(sprint: Sprint, props: SprintProperties, endDate: Date): void {
        sprint.notifyObservers("Cannot set end date in a finshed sprint.");;
    }

    addBacklogItem(sprint: Sprint, todoList: ListStategy, item: BacklogItem): void {
        sprint.notifyObservers("Cannot add backlog item to a finished sprint.");
    }

    removeBacklogItem(sprint: Sprint, item: BacklogItem): void {
        sprint.notifyObservers("Cannot remove backlog item from a finished sprint.");
    }

    startSprint(sprint: Sprint): void {
        sprint.notifyObservers("Cannot start a sprint that is already finished.");
    }

    finishSprint(sprint: Sprint): void {
        sprint.notifyObservers("Cannot finish a sprint that is already finished.");
    }

    closeSprint(sprint: Sprint): void {
        sprint.setState(new ClosedState());
        sprint.notifyObservers('Sprint closed');
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

        this.closeSprint(sprint)
        // sprint.notifyObservers("Cannot start pipeline on an activated sprint.");
    }
}