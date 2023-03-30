import { Person } from "../Person";
import { Role } from "../Roles/Role";
import { Reply } from "./Reply";
import { Thread } from "./Thread";

export class Message {
    private author: Person<Role>;
    private content: string;
    private replies: Reply[];
    private date: Date;
    private parentThread: Thread;

    constructor(author: Person<Role>, content: string, date: Date, thread: Thread) {
        this.author = author;
        this.content = content;
        this.replies = [];
        this.date = date;
        this.parentThread = thread;
    }

    public getAuthor(): Person<Role> {
        return this.author;
    }

    public getContent(): string {
        return this.content;
    }

    public getReplies(): Reply[] {
        return this.replies;
    }

    public getDate(): Date {
        return this.date;
    }

    public replyTo(author: Person<Role>, content: string, date: Date): Reply | undefined {
        if (this.parentThread.isClosed()) {
            return;
        }
        let reply = new Reply(author, content, date);
        this.replies.forEach((reply) => {
            if (reply.getAuthor() !== this.author) {
                reply.getAuthor().notifyObservers(`A reply was posted to a message in thread ${this.parentThread}`);
            }
        });
        this.author.notifyObservers(`A reply was posted to your message in thread ${this.parentThread}`);
        this.replies.push(reply);
        return reply;
    }


}