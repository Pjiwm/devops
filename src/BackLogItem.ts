import { nanoid } from "nanoid";
import { ActivityMap } from "./ActivityMap";
import { Observer } from "./Observer/Observer";
import { Subject } from "./Observer/Subject";
import { Person } from "./Person";
import { Role } from "./Roles/Role";
import { Sprint } from "./sprint/Sprint";

// BacklogItem class (Subject)
export class BacklogItem implements Subject {
    private title: string;
    private description: string;
    private storyPoints: number;
    private observers: Observer[];
    private id: string
    private activities: ActivityMap;
    private assignee: Person<Role> | undefined;

    constructor(title: string, description: string, storyPoints: number) {
        this.title = title;
        this.description = description;
        this.observers = [];
        this.storyPoints = storyPoints;
        this.id = nanoid();
        this.activities = new ActivityMap();
    }

    public getId(): string {
        return this.id;
    }

    public getTitle(): string {
        return this.title;
    }

    public setTitle(title: string) {
        this.title = title;
        this.notifyObservers("Changed title");
    }

    public getStoryPoints(): number {
        return this.storyPoints
    }

    public setStoryPoints(storyPoints: number): void {
        this.storyPoints = storyPoints;
    }

    public getDescription(): string {
        return this.description;
    }

    public setDescription(description: string) {
        this.description = description;
        this.notifyObservers("Changed description");
    }

    public getActivities(): ActivityMap {
        return this.activities;
    }

    public addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    public getAssignee(): Person<Role> | undefined {
        return this.assignee;
    }

    public setAssignee(assignee: Person<Role>): void {
        this.assignee = assignee;
        this.notifyObservers("Set assignee");
    }

    public swapAssignee(sprint: Sprint, assignee: Person<Role>): void {
        let currentAssignee = this.assignee?.getUsername();
        this.assignee = assignee;
        let msg = `Backlog Item update: ${currentAssignee} has been swapped with ${assignee.getUsername()}`
        this.notifyObservers("Swapped assignee");
        sprint.getScrumMaster()
            .notifyObservers(msg + `for ${this.title} in sprint ${sprint.getId()}`);
    }

    public addActivity(activity: string): void {
        this.activities.addActivity(activity);
        this.notifyObservers("Added activity");
    }

    public setActivity(acitivty: string, checked: boolean): void {
        this.activities.setActivity(acitivty, checked);
        this.notifyObservers("Set activity");
    }

    public removeObserver(observer: Observer): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    public notifyObservers(message: string): void {
        for (const observer of this.observers) {
            observer.update(this, message);
        }
    }

    public toString(): string {
        return `[BacklogItem-${this.id}]: ${this.title} - ${this.description} - ${this.storyPoints}`;
    }
}