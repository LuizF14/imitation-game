import { Text } from "./value_object/Text.js";

export class GenContentCategory {
    public name : Text;
    public basePrompt : Text;

    constructor(name : string, basePrompt : string) {
        this.name = new Text(name);
        this.basePrompt = new Text(basePrompt);
    }

}