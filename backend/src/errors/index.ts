import { StatusCodes } from "http-status-codes";
import CustomApiError from "./CustomApiError.js";
class BadRequestError extends CustomApiError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
class NotFoundError extends CustomApiError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
class UnAuthenticatedError extends CustomApiError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
class UnAuthorizedError extends CustomApiError {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
export {
  BadRequestError,
  CustomApiError,
  UnAuthenticatedError,
  UnAuthorizedError,
  NotFoundError,
};
