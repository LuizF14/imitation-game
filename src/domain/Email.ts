import validator from 'validator';
import { ValidationError } from '../errors/errors.js';

export class Email {
    private _value! : string;

    constructor(value: string) {
        if (!validator.isEmail(value)) {
            throw new ValidationError("Invalid email");
        }
        this.value = value;
    }
    
    set value(value : string) {
        if (!validator.isEmail(value)) {
            throw new ValidationError("Invalid email");
        }
        this._value = value;
    }

    get value() {
        return this._value;
    }
}