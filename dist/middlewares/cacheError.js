"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwError = void 0;
const throwError = (errorMsg, statusCode) => {
    const error = new Error(errorMsg);
    error.statusCode = statusCode;
    Error.captureStackTrace(error, exports.throwError);
    throw error;
};
exports.throwError = throwError;
