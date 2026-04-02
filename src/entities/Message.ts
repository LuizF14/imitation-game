import { Text } from "./value_object/Text.js";

export class Message {
    public createdAt : Date;
    public content : Text;
    private _creationDurationMs! : number;

    constructor(content: string, createdAt : Date, creationDurationMs : number) {
        this.content = new Text(content, 1024);
        this.createdAt = createdAt;
        this.creationDurationMs = creationDurationMs;
    }

    set creationDurationMs(duration : number) {
        if (duration < 0) {
            throw new Error("Creation duration cannot be negative");
        }
        this._creationDurationMs = duration;
    }

    get creationDurationMs() : number {
        return this._creationDurationMs;
    }
}