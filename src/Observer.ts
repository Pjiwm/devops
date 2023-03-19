// Observer interface for the Observer design pattern
interface Observer {
    update(username: string, message: string): void;
}

export { Observer };