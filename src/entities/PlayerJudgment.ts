import type { Player } from "./Player.js";
import type { User } from "./User.js";

export class PlayerJudgment {
    private _turingRate! : number;
    public isCorrect : boolean | undefined;
    public submittedAt : Date;
    public judge : User;
    public judged : Player;

    constructor(rating : number, judge : User, judged : Player, submittedAt : Date) {
        this.turingRate = rating;
        this.submittedAt = submittedAt;
        this.judge = judge;
        this.judged = judged;
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
}