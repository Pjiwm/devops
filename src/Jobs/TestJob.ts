import { Job } from "./Job";
import { JobVisitor } from "./JobVisitor";

export class TestJob extends Job {
    accept(visitor: JobVisitor): boolean {
      console.log("--- Starting TestJob ---\n");
      const result = visitor.visitTestJob(this);
      console.log("\n--- Finished TestJob ---\n");
      return result;
    }
  }