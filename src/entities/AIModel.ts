import { Text } from "./value_object/Text.js";
import { Score } from "./value_object/Score.js";

export abstract class AIModel {
    public name : Text;
    public score : Score = new Score();

    constructor(name : string) {
        this.name = new Text(name, 256);
    }
}