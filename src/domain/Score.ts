export class Score {
    private _value! : number;
    
    constructor(value? : number) {
        this._value = value ?? 0;
    }

    add(points: number): void {
        if (points < 0) throw new Error("Cannot add negative points.");
        this._value += points;
    }

    get value() {
        return this._value;
    }
}