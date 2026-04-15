import { Text } from "./value_object/Text.js";
import { Score } from "./value_object/Score.js";
import type { AIProvider } from "./AIProvider.js";

export abstract class AIModel {
    public name : Text;
    public score : Score = new Score();
    public provider : AIProvider;

    constructor(name : string, provider : AIProvider, score? : number) {
        this.name = new Text(name, 256);
        this.provider = provider;
        this.score = new Score(score) ?? new Score();
    }
}