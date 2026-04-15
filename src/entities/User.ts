import { Player } from "./Player.js"
import { Password } from './value_object/Password.js';
import { Email } from './value_object/Email.js';
import { Score } from "./value_object/Score.js";
import { Text } from "./value_object/Text.js";

export class User extends Player { 
    public email : Email;
    public password : Password;
    public score : Score;
    public username : Text;

    constructor(username : string, email : string, password : Password, score? : number) {
        super();
        this.username = new Text(username, 40);
        this.email = new Email(email);
        this.password = password;
        this.score = new Score(score) ?? new Score();
    }
}