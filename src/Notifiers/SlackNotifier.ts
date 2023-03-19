import { Observer } from "../Observer";

// Concrete observer class for sending notifications via Slack
class SlackNotifier implements Observer {
  private slackUsername: string;

  constructor(slackUsername: string) {
    this.slackUsername = slackUsername;
  }

  // Update method called by the subject when a change occurs
  update(username: string, message: string): void {
    console.log(`Sending Slack notification to ${this.slackUsername}: ${message}`);
    // TODO: Implement sending Slack notification
  }
}

export { SlackNotifier };