import { Branch } from "./Branch";

export class Repository {
    branches: Branch[];
    master: Branch;

    constructor(masterBranchName: string) {
        this.master = new Branch(masterBranchName);
        this.branches = [this.master];
    }

    public addBranch(branchName: string): void {
        this.branches.push(new Branch(branchName));
    }

    public getBranches(): Branch[] {
        return this.branches;
    }

    public getMasterBranch(): Branch {
        return this.master;
    }

    public getBranch(branchName: string): Branch | undefined {
        return this.branches.find(branch => branch.getName() === branchName);
    }

    public deleteBranch(branchName: string): void {
        let branch = this.getBranch(branchName);
        if (branch === undefined) {
            return;
        }

        const index = this.branches.indexOf(branch);

        if (index !== -1) {
            this.branches.splice(index, 1);
        }
    }

}