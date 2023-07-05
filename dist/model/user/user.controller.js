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
exports.resetPassword = exports.forgot_password = exports.protect = exports.login_user = exports.create_user = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const cacheError_1 = require("../../middlewares/cacheError");
const http_status_codes_1 = require("http-status-codes");
const model_user_1 = require("./model.user");
const catchAsync_1 = require("../../utils/catchAsync");
dotenv_1.default.config();
exports.create_user = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { first_name, last_name, password, email } = req.body;
        if (!first_name || !last_name || !password || !email)
            return next((0, cacheError_1.throwError)('Missing credentials, please provide all required information', http_status_codes_1.StatusCodes.BAD_REQUEST));
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
    const user = yield model_user_1.UserModel.findOne({ email: req.body.email });
    console.log(user);
    if (!user)
        return next((0, cacheError_1.throwError)('Sorry, No user found with this email', http_status_codes_1.StatusCodes.BAD_REQUEST));
    try {
        const resetToken = user.createPasswordResetToken();
        yield user.save({ validateBeforeSave: false });
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
        const emailjsTemplate = {
            service_id: 'default_service',
            template_id: `${process.env.EMAILJS_TEMPLATE_ID}`,
            user_id: `${process.env.EMAILJS_PUBLIC_KEY}`,
            accessToken: `${process.env.EMAILJS_PRIVATE_KEY}`,
            template_params: {
                name: user === null || user === void 0 ? void 0 : user.first_name,
                message: `Forgot your  password ? make a
      request with your new password and passwordConfirm to
       ${resetURL}.\nif you didn't forget your password, please ignore this email`,
                subject: 'Password reset Token',
            },
        };
        yield axios_1.default
            .post('https://api.emailjs.com/api/v1.0/email/send', {
            data: JSON.stringify(emailjsTemplate),
            contentType: 'application/json',
        })
            .then((response) => console.log(response));
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: 'success',
            message: 'Token sent to your email',
        });
    }
    catch (error) {
        user.password_reset_token = undefined;
        user.password_reset_expires = undefined;
        yield user.save({ validateBeforeSave: false });
        console.log(error);
        return next((0, cacheError_1.throwError)('There was an error sending Email, try again', http_status_codes_1.StatusCodes.BAD_GATEWAY));
    }
}));
exports.resetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = yield User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {
            $gt: Date.now()
        }
    });
    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError("Token is invalid or has expired", 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    yield user.save();
    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
}));
