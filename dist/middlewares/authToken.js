"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cacheError_1 = require("./cacheError");
exports.default = (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            (0, cacheError_1.throwError)('No token provided', 401);
        }
        let decode;
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
        decode = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`);
        if (!token || !decode) {
            (0, cacheError_1.throwError)('Invalid token', 401);
        }
        req.id = decode === null || decode === void 0 ? void 0 : decode.id;
        next();
    }
    catch (error) {
        const errorResponse = new Error('Not authorized');
        errorResponse.statusCode = 401;
        next(errorResponse);
    }
};
