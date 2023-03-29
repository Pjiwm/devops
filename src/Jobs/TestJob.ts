import { Job } from "./Job";
import { JobVisitor } from "./JobVisitor";

export class TestJob extends Job {
    accept(visitor: JobVisitor): boolean {
      return visitor.visitTestJob(this);
    }
  }