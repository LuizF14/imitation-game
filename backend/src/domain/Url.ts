import validator from 'validator';
import { ValidationError } from '../errors/errors.js';

export class Url {
    private _value!: string;

    constructor(value: string) {
        this.value = value;
    }

    set value(value: string) {
        if (!validator.isURL(value, {
            require_protocol: true,
            protocols: ['http', 'https'],
        })) {
            throw new ValidationError("Invalid URL");
        }

        this._value = value;
    }

    get value() {
        return this._value;
    }
}
