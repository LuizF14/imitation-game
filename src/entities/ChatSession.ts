import type { Message } from "./Message.js";
import type { Player } from "./Player.js";
import type { PlayerJudgment } from "./PlayerJudgment.js";

export class ChatSession {
    public startedAt : Date;
    public endedAt : Date | undefined;
    public messages : Message[] = [];
    public players : [Player, Player];
    public playersJudgement : PlayerJudgment[] = [];

    constructor (player1 : Player, player2 : Player) {
        this.startedAt = new Date();
        this.players = [player1, player2];
    }

    getJudgmentOf(player: Player): PlayerJudgment | undefined {
        return this.playersJudgement.find(j => j.judge === player);
    }

    getOpponentOf(player: Player): Player {
        const opponent = this.players.find(p => p !== player);
        if (!opponent) throw new Error("Player not found in this session.");
        return opponent;
    }
}