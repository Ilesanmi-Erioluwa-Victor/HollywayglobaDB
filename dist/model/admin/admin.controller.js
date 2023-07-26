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
exports.adminSignIn = exports.adminSignUp = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../../helper/utils");
const cacheError_1 = require("../../middlewares/error/cacheError");
const db_1 = require("../../configurations/db");
const sendMail_1 = require("../../templates/sendMail");
exports.adminSignUp = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name)
            return next((0, cacheError_1.throwError)('Missing credentials, please provide all required information', http_status_codes_1.StatusCodes.BAD_REQUEST));
        const exist_admin = yield db_1.prisma.admin.findUnique({ where: { email } });
        if (exist_admin) {
            return next((0, cacheError_1.throwError)('You are already an admin, kindly login to your account', http_status_codes_1.StatusCodes.CONFLICT));
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const admin = yield db_1.prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });
        (0, utils_1.generateToken)(admin === null || admin === void 0 ? void 0 : admin.id);
        const tokenAdmin = yield (0, utils_1.createAccountVerificationTokenAdmin)(admin === null || admin === void 0 ? void 0 : admin.id);
        yield (0, sendMail_1.sendMailAdmin)(tokenAdmin, req, res, next);
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            message: 'You have successfully created your account, log in now',
            status: 'success',
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.adminSignIn = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    try {
        const admin = yield ((_a = db_1.prisma.admin) === null || _a === void 0 ? void 0 : _a.findUnique({
            where: {
                email,
            },
        }));
        if (!admin) {
            (0, cacheError_1.throwError)('No user found', http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        if (yield bcryptjs_1.default.compare(password, admin === null || admin === void 0 ? void 0 : admin.password)) {
            if (!admin.isAccountVerified) {
                (0, cacheError_1.throwError)('Verify your account in your gmail before you can log in', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            res.json({
                id: admin === null || admin === void 0 ? void 0 : admin.id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                profilePhoto: admin.profilePhoto,
                token: (0, utils_1.generateToken)(admin === null || admin === void 0 ? void 0 : admin.id),
            });
        }
        else {
            res.status(401);
            (0, cacheError_1.throwError)(`Login Failed, invalid credentials..`, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
