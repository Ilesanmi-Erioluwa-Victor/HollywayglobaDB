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
exports.forgot_password = exports.protect = exports.login_user = exports.create_user = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const cacheError_1 = require("../../middlewares/cacheError");
const http_status_codes_1 = require("http-status-codes");
const model_user_1 = require("./model.user");
const catchAsync_1 = require("../../utils/catchAsync");
dotenv_1.default.config();
exports.create_user = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, last_name, password, email } = req.body;
        if (!first_name || !last_name || !password || !email) {
            return next((0, cacheError_1.throwError)('Missing credentials, please provide all required information', http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        const exist_user = yield model_user_1.UserModel.findOne({ email });
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        if (exist_user) {
            return next((0, cacheError_1.throwError)('You are already a member, kindly login to your account', http_status_codes_1.StatusCodes.CONFLICT));
        }
        const user = yield model_user_1.UserModel.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
        });
        yield user.save();
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            message: 'You have successfully created your account, log in now',
            status: 'success',
            userId: user === null || user === void 0 ? void 0 : user._id,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.login_user = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const exist_user = yield model_user_1.UserModel.findOne({ email });
        const userCorrectPassword = bcryptjs_1.default.compare(password, exist_user === null || exist_user === void 0 ? void 0 : exist_user.password);
        if (!exist_user || !(yield userCorrectPassword)) {
            return next((0, cacheError_1.throwError)('Sorry, Invalid credentials..., Check your credentials', http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        const token = jsonwebtoken_1.default.sign({
            email: exist_user === null || exist_user === void 0 ? void 0 : exist_user.email,
            id: exist_user === null || exist_user === void 0 ? void 0 : exist_user._id,
        }, `${process.env.JWT_SERCRET_KEY}`, { expiresIn: `${process.env.JWT_EXPIRES_IN}` });
        res.status(200).json({
            status: 'Success',
            message: 'user logged in successfully',
            token,
            userId: exist_user === null || exist_user === void 0 ? void 0 : exist_user._id,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.protect = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next((0, cacheError_1.throwError)('You are not logged in! Please log in to get access.', 401));
        }
        //  Verification token
        const decoded = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SERCRET_KEY}`, (err, decoded) => {
            if (err)
                return next((0, cacheError_1.throwError)(`${err}`, http_status_codes_1.StatusCodes.BAD_REQUEST));
            return decoded;
        });
        const current_user = yield model_user_1.UserModel.findById(decoded === null || decoded === void 0 ? void 0 : decoded.id);
        if (!current_user) {
            return next((0, cacheError_1.throwError)('The user belonging to this token does no longer exist.', http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        // ) Check if user changed password after the token was issued
        if (current_user.changePasswordAfter(decoded.iat)) {
            return next((0, cacheError_1.throwError)('User recently changed password! Please log in again.', http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = current_user;
        next();
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.forgot_password = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_user_1.UserModel.findOne({ email: req.body.email });
        if (!user) {
            return next((0, cacheError_1.throwError)('Sorry, No user found with this email', http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        // if (!user) {
        //   return next(
        //     new AppError("Sorry, there is no user with that email address", 404)
        //   );
        // }
        // // 2)Get the random reset token
        // const resetToken = user.createPasswordResetToken();
        // await user.save({ validateBeforeSave: false });
        // // 3)send it's to user email
        // const resetURL = `${req.protocol}://${req.get(
        //   "host"
        // )}/api/v1/users/resetPassword/${resetToken}`;
        // const message = `Forgot your  password ? make a
        // request with your new password and passwordConfirm to
        //  ${resetURL}.\nif you didn't forget your password, please ignore this email`;
        // try {
        //   await sendEmail({
        //     email: user.email,
        //     subject: "Your password rest token (valid for 10 min)",
        //     message: message
        //   });
    }
    catch (error) { }
}));
