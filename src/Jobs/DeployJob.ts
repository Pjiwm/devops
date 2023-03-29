import { Job } from "./Job";
import { JobVisitor } from "./JobVisitor";

export class DeployJob extends Job {
    accept(visitor: JobVisitor): boolean {
      return visitor.visitDeployJob(this);
    }

    publishCode(): boolean {
        // Give download link to the public
        return true;
    }

  }