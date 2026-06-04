export class AppError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}
