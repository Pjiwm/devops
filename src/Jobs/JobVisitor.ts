import { BuildJob } from "./BuildJob";
import { DeployJob } from "./DeployJob";
import { InstallPackagesJob } from "./InstallPackagesJob";
import { TestJob } from "./TestJob";

export interface JobVisitor {
    visitInstallingPackagesJob(job: InstallPackagesJob): boolean;
    visitBuildJob(job: BuildJob): boolean;
    visitTestJob(job: TestJob): boolean;
    visitDeployJob(job: DeployJob): boolean;
  }