import { Job } from "./Job";
import { JobVisitor } from "./JobVisitor";

export class InstallPackagesJob extends Job {
    accept(visitor: JobVisitor): boolean {
      console.log("--- Starting InstallPackagesJob ---\n");
      const result = visitor.visitInstallingPackagesJob(this);
      console.log("\n--- Finished InstallPackagesJob ---\n");
      return result;
    }
  }