import { Job } from "./Job";
import { JobVisitor } from "./JobVisitor";

export class BuildJob extends Job {
    accept(visitor: JobVisitor): boolean {
      return visitor.visitBuildJob(this);
    }
  }