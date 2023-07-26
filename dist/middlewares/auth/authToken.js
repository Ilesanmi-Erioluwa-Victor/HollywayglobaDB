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
const cacheError_1 = require("../error/cacheError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../../helper/utils");
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../../configurations/db");
const utils_2 = require("../../helper/utils");
const config_1 = require("../../configurations/config");
exports.AuthMiddleWare = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let token;
    try {
        if (req.headers.authorization &&
            ((_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization.startsWith('Bearer'))) {
            token = (_b = req === null || req === void 0 ? void 0 : req.headers) === null || _b === void 0 ? void 0 : _b.authorization.split(' ')[1];
            if (!`${config_1.ENV.JWT.SECRET}`) {
                (0, cacheError_1.throwError)('SERVER JWT PASSWORD NOT SET', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            if (token) {
                const decoded = jsonwebtoken_1.default.verify(token, `${config_1.ENV.JWT.SECRET}`);
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
exports.isUserVerified = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req === null || req === void 0 ? void 0 : req.authId;
        (0, utils_2.ValidateMongoDbId)(id);
        const user = yield db_1.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        if (!(user === null || user === void 0 ? void 0 : user.isAccountVerified)) {
            (0, cacheError_1.throwError)('Sorry, your account is not verified, please check your email and verify your email', http_status_codes_1.StatusCodes.BAD_REQUEST);
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