import type { User } from "./User.js";

export class PlayerJudgment {
    private _turingRate! : number;
    public submittedAt : Date;
    public judge : User;

    constructor(rating : number, judge : User, submittedAt : Date) {
        this.turingRate = rating;
        this.submittedAt = submittedAt;
        this.judge = judge;
    }

    set turingRate(rating : number) {
        if (rating < 0 || rating > 1) {
            throw new Error("Invalid turing rate.");
        }
        this._turingRate = rating;
    }

    get turingRate() {
        return this._turingRate;
    }

    private static readonly K = 1000;
    private static readonly MAX_SESSION_SECONDS = 300;
    calculatePlayerScore(sessionStartedAt: Date, opponentIsHuman: boolean, aiScore?: number): number {
        const timedelta = (this.submittedAt.getTime() - sessionStartedAt.getTime()) / 1000;

        const confidence = opponentIsHuman ? this._turingRate : (1 - this._turingRate);
        const time_multiplier = Math.max(0.2, 1 - (timedelta / PlayerJudgment.MAX_SESSION_SECONDS));
        const model_multiplier = opponentIsHuman ? 1 : (1 + Math.tanh((aiScore ?? 0) / PlayerJudgment.K));

        return 100 * confidence * time_multiplier * model_multiplier;
    }

    calculateAIScore() : number {
        return this.turingRate;
    }
}