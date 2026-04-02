export class Score {
    private _value! : number;
    
    constructor() {
        this.value = 0;
    }

    set value(value : number) {
        if (value < 0) {
            throw new Error("Invalid score value");
        }
        this._value = value;
    }

    get value() {
        return this._value;
    }
}