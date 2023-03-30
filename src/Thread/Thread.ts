import { nanoid } from "nanoid";
import { BacklogItem } from "../BackLogItem";
import { Observer } from "../Observer/Observer";
import { Subject } from "../Observer/Subject";
import { Person } from "../Person";
import { Role } from "../Roles/Role";
import { Sprint } from "../Sprint/Sprint";
import { Message } from "./Message";

export class Thread implements Observer {
    private relatedItem: BacklogItem;
    private messages: Message[];
    private participants: Set<Person<Role>>;
    private title: string;
    private id: string;
    private originalPoster : Person<Role>;
    private closed: boolean;

    constructor(originalPoster: Person<Role>, relatedItem: BacklogItem, sprint: Sprint, title: string) {
        this.relatedItem = relatedItem;
        this.messages = [];
        this.participants = new Set<Person<Role>>();
        this.id = nanoid();
        this.closed = false;
        this.title = title;
        this.originalPoster = originalPoster;

        sprint.addAssociatedThread(this);
    }

    public isClosed(): boolean {
        return this.closed;
    }

    public getOriginalPoster(): Person<Role> {
        return this.originalPoster;
    }

    public getMessages(): Message[] {
        return this.messages;
    }

    postMessage(person: Person<Role>, content: string, date: Date): Message | undefined {
        if (this.isClosed()) {
            return;
        }
        let message = new Message(person, content, date, this);
        this.participants.add(message.getAuthor());
        this.messages.push(message);
        return message;
    }

    update(subject: Subject, _message: string): void {
        if (subject instanceof Sprint) {
            if (subject.getDoneList().contains(this.relatedItem)) {
                this.closed = true;
            }
        }
    }

    public toString(): string {
        return `[${this.id}] ` + this.title;
    }


}