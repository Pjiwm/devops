console.log("test")

import { PersonFactory } from "./Person";
import { SlackNotifier } from "./Notifiers/SlackNotifier";
import { EmailNotifier } from "./Notifiers/EmailNotifier";

// Example usage

// Create a factory for creating Person objects with different roles
const personFactory = new PersonFactory();

// Create some Person objects
const scrumMaster = personFactory.createPerson("Scrum Master", "scrum-master", ["slack", "email"]);
const tester = personFactory.createPerson("Tester", "tester", ["slack"]);
const leadDeveloper = personFactory.createPerson("Lead Developer", "lead-dev", ["email"]);
const developer = personFactory.createPerson("Developer", "dev", ["slack", "email"]);

// Create some observers to receive notifications
const slackNotifier = new SlackNotifier("my-slack-username");
const emailNotifier = new EmailNotifier("my-email-address@example.com");

// Register the observers with the Person objects
scrumMaster.addObserver(slackNotifier);
scrumMaster.addObserver(emailNotifier);
tester.addObserver(slackNotifier);
leadDeveloper.addObserver(emailNotifier);
developer.addObserver(slackNotifier);
developer.addObserver(emailNotifier);

// Perform some actions that require notification
scrumMaster.doAction("created a new user story");
tester.doAction("reported a bug");
leadDeveloper.doAction("approved a pull request");
developer.doAction("committed changes");

// Change the notification media for a Person
developer.setNotificationMedia(["email"]);

// Perform another action that requires notification
developer.doAction("requested a code review");