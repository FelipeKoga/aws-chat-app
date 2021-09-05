/* eslint-disable max-classes-per-file */

export class BaseError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class UserAlreadyExists extends BaseError {
    constructor(message: string) {
        super(409, message);
        this.name = UserAlreadyExists.name;
    }
}

export class NotFound extends BaseError {
    constructor(message: string) {
        super(404, message);
        this.name = NotFound.name;
    }
}

export class UnknowError extends BaseError {
    constructor(message: string) {
        super(500, message);
        this.name = UnknowError.name;
    }
}
