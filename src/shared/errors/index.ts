/* eslint-disable max-classes-per-file */

export class BaseError extends Error {
    statusCode: number;

    code: string;

    constructor(statusCode: number, code: string, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
    }
}
export class UserAlreadyExists extends BaseError {
    constructor(message: string) {
        super(409, 'UserAlreadyExists', message);
    }
}
export class NotFound extends BaseError {
    constructor(message: string) {
        super(404, 'NotFound', message);
    }
}
export class UnknowError extends BaseError {
    constructor(message: string) {
        super(500, 'UnknowError', message);
    }
}
