import { Job } from "./Job";
import { JobVisitor } from "./JobVisitor";

export class FailingJob extends Job {
  accept(visitor: JobVisitor): boolean {
    console.log("Starting FailingJob...");
    throw new Error("FailingJob failed.");
  }
}