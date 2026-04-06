import validator from 'validator';

export class Password {
    private _value! : string;

    constructor(value: string) {
        this.value = value;
    }

    set value(value : string) {
        if (!validator.isHash(value, "sha256")) {
            throw new Error("Invalid password hash");
        }
        this._value = value;
    }

    get value() {
        return this._value;
    }
}
