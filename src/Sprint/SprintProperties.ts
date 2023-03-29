export class SprintProperties {
    private name: string;
    private startDate: Date;
    private endDate: Date;

    constructor(name: string, startDate: Date, endDate: Date) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    getName(): string {
        return this.name;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    setName(name: string): void {
        this.name = name;
    }

    setStartDate(startDate: Date): void {
        this.startDate = startDate;
    }

    setEndDate(endDate: Date): void {
        this.endDate = endDate;
    }
}