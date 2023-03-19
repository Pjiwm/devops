import { Observer } from "../Observer";

// Concrete observer class for sending notifications via email
class EmailNotifier implements Observer {
  private emailAddress: string;

  constructor(emailAddress: string) {
    this.emailAddress = emailAddress;
  }

  // Update method called by the subject when a change occurs
  update(username: string, message: string): void {
    console.log(`Sending email notification to ${this.emailAddress}: ${message}`);
    // TODO: Implement sending email notification
  }
}

export { EmailNotifier };