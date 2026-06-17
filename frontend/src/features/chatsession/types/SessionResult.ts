export interface SessionResult {
    won: boolean;
    opponentType: "Human" | "AI";
    opponentName: string;
    pointsEarned: number;
    turingRateReceived: number;
}
