import { BacklogItem } from "../BackLogItem";

// BacklogList interface (Strategy)
export interface BacklogList {
    addBacklogItem(backlogItem: BacklogItem): void;
    removeBacklogItem(backlogItem: BacklogItem): void;
    getName(): string;
}