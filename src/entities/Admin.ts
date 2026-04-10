import { Password } from './value_object/Password.js';
import { Email } from './value_object/Email.js'
import type { AIProvider } from './AIProvider.js';
import { Text } from './value_object/Text.js';

export class Admin {
    public password : Password;
    public email : Email;
    public name: Text;
    public evaluatedProviders : AIProvider[] = [];

    constructor (name : string, email : string, password : Password) {
        this.name = new Text(name, 60);
        this.email = new Email(email);
        this.password = password;
    }
}