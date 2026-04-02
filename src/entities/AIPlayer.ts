import { AIModel } from "./AIModel.js";
import { Player } from "./Player.js";
import crypto from 'node:crypto';

export class AIPlayer extends Player {
    public readonly instanceID : string;
    public model : AIModel;

    constructor(model : AIModel, instanceID? : string) {
        super();
        this.model = model;
        this.instanceID = instanceID ?? crypto.randomUUID();
    }
}