import { ValidationError } from "../errors/errors.js";

export class Text {
    private _value! : string;
    private _maxLength : number;
    
    constructor(value: string, maxlength : number = 256) {
        this._maxLength = maxlength;
        this.value = value;
    }

    set value(value : string) {
        if (value.length >= this._maxLength) {
            throw new ValidationError(`Text cannot exceed ${this._maxLength} characters. `);
        }
        if (value.trim().length === 0) {
            throw new ValidationError("Text cannot be empty.");
        }
        this._value = value;
    }

    get value() {
        return this._value;
    }
}