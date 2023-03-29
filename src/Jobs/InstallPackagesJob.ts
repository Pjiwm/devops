import { Job } from "./Job";
import { JobVisitor } from "./JobVisitor";

export class InstallPackagesJob extends Job {
    accept(visitor: JobVisitor): boolean {
      return visitor.visitInstallingPackagesJob(this);
    }
  }