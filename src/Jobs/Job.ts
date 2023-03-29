import { JobVisitor } from "./JobVisitor";

export abstract class Job {
    abstract accept(visitor: JobVisitor): boolean;
  }