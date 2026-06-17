export interface Message {
    id: string;
    from: "me" | "opponent";
    text: string;
    timestamp: Date;
}