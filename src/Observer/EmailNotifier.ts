import { Observer } from "./Observer";
import { Subject } from "./Subject";


// Concrete observer class for sending notifications via email
class EmailNotifier implements Observer {
  private emailAddress: string;

  constructor(emailAddress: string) {
    this.emailAddress = emailAddress;
  }

  // Update method called by the subject when a change occurs
  update(subject: Subject, message: string): void {
    console.log(`Sending email notification to ${this.emailAddress}: ${message}`);
  }
}

export { EmailNotifier };