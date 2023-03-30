import { Person } from "../Person";
import { Role } from "../Roles/Role";

export class Reply {
    private author: Person<Role>;
    private content: string;
    private date: Date;

    constructor(author: Person<Role>, content: string, date: Date) {
        this.author = author;
        this.content = content;
        this.date = date;
    }

    public getAuthor(): Person<Role> {
        return this.author;
    }

    public getContent(): string {
        return this.content;
    }

    public getDate(): Date {
        return this.date;
    }
}