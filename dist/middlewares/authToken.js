"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserVerified = exports.AuthMiddleWare = void 0;
const cacheError_1 = require("./cacheError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const catchAsync_1 = require("../utils/catchAsync");
const http_status_codes_1 = require("http-status-codes");
const prisma_1 = require("../prisma");
const ValidateMongoId_1 = __importDefault(require("../utils/ValidateMongoId"));
dotenv_1.default.config();
exports.AuthMiddleWare = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let token;
    try {
        if (req.headers.authorization &&
            ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization.startsWith('Bearer'))) {
            token = (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.authorization.split(' ')[1];
            if (!`${process.env.JWT_SERCRET_KEY}`) {
                (0, cacheError_1.throwError)('SERVER JWT PASSWORD NOT SET', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            if (token) {
                const decoded = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SERCRET_KEY}`);
                req.authId = decoded.id;
            }
        }
        else {
            (0, cacheError_1.throwError)(`Sorry, there is no token attached to your Header, try again by attaching Token..`, http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        next();
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.isUserVerified = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req === null || req === void 0 ? void 0 : req.authId;
        (0, ValidateMongoId_1.default)(id);
    }
    catch (error) { }
    console.log('This is user ' + id);
    if (!id)
        throw new Error('No user with this ID');
    const user = yield prisma_1.prisma.user.findUnique({
        where: {
            id: id,
        },
    });
    c;
    next();
}));
