import { Job } from "./Job";
import { JobVisitor } from "./JobVisitor";

export class DeployJob extends Job {
    accept(visitor: JobVisitor): boolean {
      console.log("--- Starting DeployJob ---\n");
      const result = visitor.visitDeployJob(this);
      console.log("\n--- Finished DeployJob ---\n");
      return result;
    }

    publishCode(): boolean {
        // Give download link to the public
        return true;
    }

  }