export class ActivityMap {
    private activities: Map<string, boolean>;

    constructor() {
        this.activities = new Map<string, boolean>();
    }

    public addActivity(activity: string): void {
        this.activities.set(activity, false);
    }

    public setActivity(activity: string, value: boolean): void {
        this.activities.set(activity, value);
    }

    public removeActivity(activity: string): void {
        this.activities.delete(activity);
    }

    public getActivity(activity: string): boolean {
        let value = this.activities.get(activity);
        if (value === undefined) {
            return false;
        }
        return value;
    }
}
