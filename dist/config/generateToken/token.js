"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cacheError_1 = require("../../middlewares/cacheError");
const http_status_codes_1 = require("http-status-codes");
dotenv_1.default.config();
const generateToken = (id) => {
    if (!process.env.JWT_SERCRET_KEY)
        (0, cacheError_1.throwError)('JWT_KEY is required in environment', http_status_codes_1.StatusCodes.BAD_REQUEST);
    return jsonwebtoken_1.default.sign({ id }, `${process.env.JWT_SERCRET_KEY}`, {
        expiresIn: `${process.env.JWT_EXPIRES_IN}`,
    });
};
exports.default = generateToken;
