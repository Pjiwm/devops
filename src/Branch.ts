export class Branch {
    private name: string;
    private commits: string[];

    constructor(name: string) {
        this.name = name;
        this.commits = [];
    }

    public addCommit(commit: string): void {
        this.commits.push(commit);
    }

    public getCurrentCommit(): string {
        return this.commits[this.commits.length - 1];
    }

    public getCommits(): string[] {
        return this.commits;
    }

    public getName(): string {
        return this.name;
    }
}