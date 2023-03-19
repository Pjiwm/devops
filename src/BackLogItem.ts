import { nanoid } from "nanoid";
import { Observer } from "./Observer/Observer";
import { Subject } from "./Observer/Subject";

// BacklogItem class (Subject)
export class BacklogItem implements Subject {
    private title: string;
    private description: string;
    private storyPoints: number;
    private observers: Observer[];
    private id: string

    constructor(title: string, description: string, storyPoints: number) {
        this.title = title;
        this.description = description;
        this.observers = [];
        this.storyPoints = storyPoints;
        this.id = nanoid();
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

    public addObserver(observer: Observer): void {
        this.observers.push(observer);
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