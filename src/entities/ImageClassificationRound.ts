import type { User } from "./User.js";
import { Image } from "./Image.js";

export class ImageClassificationRound {
    public userAnswer : boolean | undefined;
    public timeToAnswerMs : number;
    public classifierUser : User;
    public image : Image;

    constructor(image : Image, user : User, timeToAnswerMs : number) {
        this.timeToAnswerMs = timeToAnswerMs;
        this.image = image;
        this.classifierUser = user;
    }
}