export class Score {
    private _value! : number;
    
    constructor() {
        this._value = 0;
    }

    add(points: number): void {
        if (points < 0) throw new Error("Cannot add negative points.");
        this._value += points;
    }

    get value() {
        return this._value;
    }
}