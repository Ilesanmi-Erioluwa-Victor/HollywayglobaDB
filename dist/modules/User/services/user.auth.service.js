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
exports.forget_password_token = exports.accountVerification = exports.updatePassword = exports.updateUser = exports.getUser = exports.loginUser = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = require("http-status-codes");
const cacheError_1 = require("../../../middlewares/error/cacheError");
const utils_1 = require("../../../helper/utils");
const models_1 = require("../models");
const sendMail_1 = require("../../../templates/sendMail");
exports.createUser = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, password, email, mobile } = req.body;
        if (!firstName || !lastName || !password || !email || !mobile)
            return next((0, cacheError_1.throwError)('Missing credentials, please provide all required information', http_status_codes_1.StatusCodes.BAD_REQUEST));
        const existEmail = yield (0, models_1.findUserMEmail)(email);
        if (existEmail)
            next((0, cacheError_1.throwError)('You are already a member, kindly login to your account', http_status_codes_1.StatusCodes.CONFLICT));
        const user = yield (0, models_1.createUserM)(req.body);
        (0, sendMail_1.sendMail)(user, req, res, next);
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
exports.loginUser = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield (0, models_1.findUserMEmail)(email);
        if (!user)
            next((0, cacheError_1.throwError)('No user found with this email', http_status_codes_1.StatusCodes.BAD_REQUEST));
        if (yield bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password)) {
            if (!user.isAccountVerified) {
                (0, cacheError_1.throwError)('Verify your account in your gmail before you can log in', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            res.json({
                id: user === null || user === void 0 ? void 0 : user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profilePhoto: user.profilePhoto,
                token: (0, utils_1.generateToken)(user === null || user === void 0 ? void 0 : user.id),
            });
        }
        else {
            (0, cacheError_1.throwError)('Login Failed, invalid credentials', http_status_codes_1.StatusCodes.UNAUTHORIZED);
        }
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.getUser = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    (0, utils_1.ValidateMongoDbId)(id);
    try {
        const user = yield (0, models_1.findUserMId)(id);
        res.json(user);
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.updateUser = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    (0, utils_1.ValidateMongoDbId)(id);
    const allowedFields = ['firstName', 'lastName', 'email'];
    const unexpectedFields = Object.keys(req.body).filter((field) => !allowedFields.includes(field));
    if (unexpectedFields.length > 0) {
        (0, cacheError_1.throwError)(`Unexpected fields: ${unexpectedFields.join(', ')}, Sorry it's not part of the parameter`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    try {
        const user = yield (0, models_1.updateUserM)(id, req.body.firstName, req.body.lastName, req.body.email);
        res.json({
            message: 'You have successfully updated your profile',
            user: user,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.updatePassword = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    const { password } = req.body;
    try {
        (0, utils_1.ValidateMongoDbId)(id);
        if (!password)
            (0, cacheError_1.throwError)('Please, provide password before you can change your current password', http_status_codes_1.StatusCodes.BAD_REQUEST);
        const user = yield (0, models_1.updateUserPasswordM)(id, password);
        res.json({
            message: 'You have successfully update your password',
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.accountVerification = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, id } = req.params;
    (0, utils_1.ValidateMongoDbId)(id);
    if (!id)
        next((0, cacheError_1.throwError)('Sorry, your id is not valid', http_status_codes_1.StatusCodes.BAD_REQUEST));
    if (!token)
        next((0, cacheError_1.throwError)('Sorry, this token is not valid, try again', http_status_codes_1.StatusCodes.BAD_REQUEST));
    try {
        const user = yield (0, models_1.accountVerificationM)(id, token, new Date());
        if (!user)
            next((0, cacheError_1.throwError)('Sorry, no user found, try again', http_status_codes_1.StatusCodes.BAD_REQUEST));
        const updaterUser = yield (0, models_1.accountVerificationUpdatedM)(user === null || user === void 0 ? void 0 : user.id, true, '', null);
        res.json({
            status: 'Success',
            message: 'You have successfully, verify your account, log in now',
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.forget_password_token = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email)
        (0, cacheError_1.throwError)('Please, provide email for you to reset your password', http_status_codes_1.StatusCodes.BAD_REQUEST);
    const user = yield prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user)
        (0, cacheError_1.throwError)('No user found with provided email.., try again', http_status_codes_1.StatusCodes.NOT_FOUND);
    try {
        const resetToken = (0, utils_1.generatePasswordResetToken)();
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 1);
        const password_reset = yield prisma.passwordResetToken.create({
            data: {
                token: resetToken,
                expirationTime,
                userId: user === null || user === void 0 ? void 0 : user.id,
            },
        });
        yield sendUserToken(password_reset, req, res, next);
        res.json({
            message: `A reset token has been sent to your gmail`,
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
