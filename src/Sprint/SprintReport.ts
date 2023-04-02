import { Person } from "../Person";
import { Role } from "../Roles/Role";
import { Sprint } from "./Sprint";

export class SprintReport {
  private sprint: Sprint;
  private teamComposition: Person<Role>[];
  private burndownChart: number;
  private effortPointsPerDeveloper: Map<string, number>;
  private headers: string;
  private footers: string;

  constructor(sprint: Sprint) {
    this.sprint = sprint;
    this.teamComposition = sprint.getMembers();
    this.burndownChart = 0;
    this.effortPointsPerDeveloper = new Map<string, number>();
    this.headers = "";
    this.footers = "";
  }

  public setTeamComposition(teamComposition: Person<Role>[]) {
    this.teamComposition = teamComposition;
  }

  public setBurndownChart(burndownChart: number) {
    this.burndownChart = burndownChart;
  }

  public setEffortPointsPerDeveloper(effortPointsPerDeveloper: Map<string, number>) {
    this.effortPointsPerDeveloper = effortPointsPerDeveloper;
  }

  public setHeaders(headers: string) {
    this.headers = headers;
  }

  public setFooters(footers: string) {
    this.footers = footers;
  }

  public getTeamComposition(): Person<Role>[] {
    return this.teamComposition;
  }

  public getBurndownChart(): number {
    return this.burndownChart;
  }

  public getEffortPointsPerDeveloper(): Map<string, number> {
    return this.effortPointsPerDeveloper;
  }

  public getHeaders(): string {
    return this.headers;
  }

  public getFooters(): string {
    return this.footers;
  }

  public generateReport(): string {
    const effortPointsPerAssignee = new Map<string, number>();
    this.sprint.getDoneList().getBacklogItems().forEach((backlogItem) => {
        const assignee = backlogItem.getAssignee();
        const storyPoints = backlogItem.getStoryPoints();
        // The Burndown chart should return a string of all the total story points
        this.burndownChart += storyPoints;

        if (assignee && storyPoints) {
            const currentEffortPoints = effortPointsPerAssignee.get(assignee.getUsername()) || 0;
            effortPointsPerAssignee.set(assignee.getUsername(), currentEffortPoints + storyPoints);
        }
    });

    this.setEffortPointsPerDeveloper(effortPointsPerAssignee);

    let report = `SPRINT REPORT: ${this.sprint.getName()}\n\n`;
    report += `Headers: ${this.headers}\n\n`;
    report += "Team Composition:\n"
    for (const member of this.teamComposition) {
        report += `${member.getUsername()}, `;
    }
    report += `\nBurndown Chart: ${this.burndownChart}\n`;
    report += "Effort Points Per Developer:\n";
    for(const [key, value] of this.effortPointsPerDeveloper.entries()) {
        report += `${key} - ${value}\n`;
    }
    report += `\n\nFooters: ${this.footers}`;

    return report;
  }
}