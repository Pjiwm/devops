import { Branch } from "./Branch";

export class Repository {
    private name: string
    private branches: Branch[];
    private master: Branch;

    constructor(name: string, masterBranchName: string) {
        this.master = new Branch(masterBranchName);
        this.branches = [this.master];
        this.name = name;
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

    public getName(): string {
        return this.name;
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