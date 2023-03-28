import { nanoid } from "nanoid";
import { SprintBacklogFactory } from "../BackLogFactory/SprintBackLogFactory";
import { Person } from "../Person";
import { Repository } from "../Repository";
import { Role } from "../Roles/Role";
import { ScrumMaster } from "../Roles/ScrumMaster";
import { SprintBacklog } from "../SprintBackLog";
import { Sprint } from "./Sprint";
import { SprintType } from "./Type";

export class SprintBuilder {
    private sprintBacklog: SprintBacklog | undefined;
    private startDate: Date | undefined;
    private endDate: Date | undefined;
    private name: string | undefined;
    private type: SprintType | undefined;
    private members: Person<Role>[] | undefined;
    private scrumMaster: Person<ScrumMaster>;

    constructor(scrumMaster: Person<ScrumMaster>) {
        this.scrumMaster = scrumMaster;
    }

    public addSprintBackLog(sprintBacklog: SprintBacklog): SprintBuilder {
        this.sprintBacklog = sprintBacklog;
        return this;
    }

    public addStartDate(startDate: Date): SprintBuilder {
        this.startDate = startDate;
        return this;
    }

    public addEndDate(endDate: Date): SprintBuilder {
        this.endDate = endDate;
        return this;
    }

    public addName(name: string): SprintBuilder {
        this.name = name;
        return this;
    }

    public addType(type: SprintType): SprintBuilder {
        this.type = type;
        return this;
    }

    public addMembers(members: Person<Role>[]): SprintBuilder {
        this.members = members;
        return this;
    }

    public addMember(member: Person<Role>): SprintBuilder {
        if (this.members === undefined) {
            this.members = [];
        }
        this.members.push(member);
        return this;
    }

    public build(): Sprint {
        let id = nanoid();
        if (this.sprintBacklog === undefined) {
            this.sprintBacklog = new SprintBacklogFactory()
                .create([], new Repository("Repository-" + id, "Master"));
        }
        if (this.startDate === undefined) {
            this.startDate = new Date();
        }
        if (this.endDate === undefined) {
            let date = new Date();
            date.setDate(date.getDate() + 14);
            this.endDate = date;
        }
        if (this.name === undefined) {
            this.name = "Sprint-" + id;
        }
        if (this.type === undefined) {
            this.type = SprintType.Release;
        }
        if (this.members === undefined) {
            this.members = [];
        }
        let sprint =
            new Sprint(this.scrumMaster, this.members, this.sprintBacklog, this.startDate, this.endDate, this.name, this.type);
        sprint.setId(id);
        return sprint;
    }
}