import { nanoid } from "nanoid";
import { BuildJob } from "./Jobs/BuildJob";
import { DeployJob } from "./Jobs/DeployJob";
import { InstallPackagesJob } from "./Jobs/InstallPackagesJob";
import { JobVisitor } from "./Jobs/JobVisitor";
import { TestJob } from "./Jobs/TestJob";

export class Pipeline implements JobVisitor {
    private id: string;
    constructor () {
        this.id = nanoid();
    }

    getId(): string {
        return this.id;
    }

    visitInstallingPackagesJob(job: InstallPackagesJob): boolean {
      return true;
    }

    visitBuildJob(job: BuildJob): boolean {
      // Implementation for running the BuildJob
      return true;
    }

    visitTestJob(job: TestJob): boolean {
      // Implementation for running the TestJob
      return true;
    }

    visitDeployJob(job: DeployJob): boolean {
      // Implementation for running the DeployJob
      return true;
    }
  }