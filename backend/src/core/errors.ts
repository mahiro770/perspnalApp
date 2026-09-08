export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'not found') {
    super(message, 404, 'not_found');
  }
}

export class ValidationError extends AppError {
  constructor(message = 'validation error') {
    super(message, 400, 'validation_error');
  }
}

export class ExternalApiError extends AppError {
  constructor(message = 'external api error') {
    super(message, 502, 'external_api_error');
  }
}
