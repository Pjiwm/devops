import { Job } from "./Job";
import { JobVisitor } from "./JobVisitor";

export class BuildJob extends Job {
    accept(visitor: JobVisitor): boolean {
      console.log("--- Starting BuildJob ---\n");
      const result = visitor.visitBuildJob(this);
      console.log("\n--- Finished BuildJob ---\n");
      return result;
    }
  }