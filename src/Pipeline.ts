import { nanoid } from "nanoid";
import { BuildJob } from "./Jobs/BuildJob";
import { DeployJob } from "./Jobs/DeployJob";
import { InstallPackagesJob } from "./Jobs/InstallPackagesJob";
import { JobVisitor } from "./Jobs/JobVisitor";
import { TestJob } from "./Jobs/TestJob";
import { Job } from "./Jobs/Job";
import { FailingJob } from "./Jobs/FailingJob";

export class Pipeline implements JobVisitor {
    private id: string;
    constructor() {
        this.id = nanoid();
    }

    getId(): string {
        return this.id;
    }

    visitInstallingPackagesJob(job: InstallPackagesJob): boolean {
        console.log('Installing packages...');
        return true;
    }

    visitBuildJob(job: BuildJob): boolean {
        console.log('Building the project...');
        return true;
    }

    visitFailingJob(job: FailingJob): boolean {
        console.log('Running failing job...');
        return true;
    }

    visitTestJob(job: TestJob): boolean {
        console.log('Running tests...');
        return true;
    }

    visitDeployJob(job: DeployJob): boolean {
        console.log('Deploying the project...');
        return true;
    }

    visitJob(job: Job): boolean {
        console.log(`Executing ${job.constructor.name} job...`);
        return job.accept(this);
    }
    
}