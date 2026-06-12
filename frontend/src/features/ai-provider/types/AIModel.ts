export interface AIModel {
    id: string;
    name: string;
    sessionsPlayed: number;
    type: "Chat" | "Image";
    score: number;
    ranking: number | null;
    active: boolean;
}