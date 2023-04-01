import { Observer } from "./Observer";
import { Subject } from "./Subject";

// Concrete observer class for sending notifications via Slack
class SlackNotifier implements Observer {
  private slackUsername: string;

  constructor(slackUsername: string) {
    this.slackUsername = slackUsername;
  }

  // Update method called by the subject when a change occurs
  update(subject: Subject, message: string): void {
    console.log(`Sending Slack notification to ${this.slackUsername}: ${message}`);
  }
}

export { SlackNotifier };