import { ValidationError } from '../errors/errors.js';

export class UriPath {
    private _value!: string;

    constructor(value: string) {
        this.value = value;
    }

    set value(value: string) {
        if (!value || typeof value !== 'string') {
            throw new ValidationError("Path cannot be empty");
        }

        if (!value.startsWith('/')) {
            throw new ValidationError("Path must start with '/'");
        }

        const pathRegex = /^\/([a-zA-Z0-9\-_.~/]*)$/;

        if (!pathRegex.test(value)) {
            throw new ValidationError("Path contains invalid characters");
        }

        if (value.includes('//')) {
            throw new ValidationError("Path cannot contain double slashes");
        }

        this._value = value;
    }

    get value(): string {
        return this._value;
    }
}