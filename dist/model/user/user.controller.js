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
exports.reset_password = exports.forget_password_token = exports.account_verification = exports.update_password = exports.update_user = exports.get_user = exports.delete_user = exports.login_user = exports.create_user = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cacheError_1 = require("../../middlewares/error/cacheError");
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../../helper/utils");
const utils_2 = require("../../helper/utils");
const utils_3 = require("../../helper/utils");
const db_1 = require("../../configurations/db");
const utils_4 = require("../../helper/utils");
const sendMail_1 = require("../../templates/sendMail");
const utils_5 = require("../../helper/utils");
exports.create_user = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, password, email, mobile } = req.body;
        if (!firstName || !lastName || !password || !email || !mobile)
            return next((0, cacheError_1.throwError)('Missing credentials, please provide all required information', http_status_codes_1.StatusCodes.BAD_REQUEST));
        const exist_user = yield db_1.prisma.user.findUnique({ where: { email } });
        if (exist_user) {
            return next((0, cacheError_1.throwError)('You are already a member, kindly login to your account', http_status_codes_1.StatusCodes.CONFLICT));
        }
        // TODO  i will write it to it logic util later
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield db_1.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                mobile,
            },
        });
        (0, utils_3.generateToken)(user === null || user === void 0 ? void 0 : user.id);
        const tokenUser = yield (0, utils_4.createAccountVerificationToken)(user === null || user === void 0 ? void 0 : user.id);
        yield (0, sendMail_1.sendMail)(tokenUser, req, res, next);
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
exports.login_user = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    try {
        const exist_user = yield ((_a = db_1.prisma.user) === null || _a === void 0 ? void 0 : _a.findUnique({
            where: {
                email: email,
            },
        }));
        if (!exist_user) {
            (0, cacheError_1.throwError)('No user found', http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        if (yield bcryptjs_1.default.compare(password, exist_user === null || exist_user === void 0 ? void 0 : exist_user.password)) {
            if (!exist_user.isAccountVerified) {
                (0, cacheError_1.throwError)('Verify your account in your gmail before you can log in', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            res.json({
                id: exist_user === null || exist_user === void 0 ? void 0 : exist_user.id,
                firstName: exist_user.firstName,
                lastName: exist_user.lastName,
                email: exist_user.email,
                profilePhoto: exist_user.profilePhoto,
                token: (0, utils_3.generateToken)(exist_user === null || exist_user === void 0 ? void 0 : exist_user.id),
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
exports.delete_user = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    (0, utils_2.ValidateMongoDbId)(id);
    //TODO i want to write logic to deleted permanently if active
    // is false for two months
    try {
        const deleted_user = yield db_1.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                active: false,
                isAccountVerified: false,
            },
        });
        res.json({
            message: 'Please, kindly note, by not logining to your account for two months, this will permanently delete your account.',
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.get_user = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    (0, utils_2.ValidateMongoDbId)(id);
    try {
        const user = yield db_1.prisma.user.findUnique({
            where: {
                id,
            },
        });
        res.json(user);
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
// export const User_profile = expressAsyncHandler(async (req, res) => {
//   const { id } = req?.params;
//   ValidateMongoDbId(id);
//   try {
//     const userProfile = await User.findById(id).populate('posts');
//     res.json(userProfile);
//   } catch (error: any) {
//     res.json(error.message);
//   }
// });
exports.update_user = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    (0, utils_2.ValidateMongoDbId)(id);
    const allowedFields = ['firstName', 'lastName', 'email'];
    const unexpectedFields = Object.keys(req.body).filter((field) => !allowedFields.includes(field));
    if (unexpectedFields.length > 0) {
        (0, cacheError_1.throwError)(`Unexpected fields: ${unexpectedFields.join(', ')}, Sorry it's not part of the parameter`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    try {
        const userprofile = yield db_1.prisma.user.update({
            where: {
                id,
            },
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
            },
        });
        res.json({
            message: 'You have successfully updated your profile',
            user: userprofile,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.update_password = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        const { password } = req.body;
        (0, utils_2.ValidateMongoDbId)(id);
        if (!password)
            (0, cacheError_1.throwError)('Please, provide password before you can change your current password', http_status_codes_1.StatusCodes.BAD_REQUEST);
        // TODO  i will write it to it logic util later
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield db_1.prisma.user.update({
            where: {
                id,
            },
            data: {
                password: hashedPassword,
            },
        });
        if (password) {
            res.json({
                message: 'You have successfully update your password',
            });
        }
        // TODO still have a bug to fix, which, when user don't provide password, use the initial one
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.account_verification = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    try {
        const user = yield db_1.prisma.user.findFirst({
            where: {
                accountVerificationToken: token,
                accountVerificationTokenExpires: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            (0, cacheError_1.throwError)('Token expired or something went wrong, try again', http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const updatedUser = yield db_1.prisma.user.update({
            where: {
                id: user === null || user === void 0 ? void 0 : user.id,
            },
            data: {
                isAccountVerified: true,
                accountVerificationToken: '',
                accountVerificationTokenExpires: null,
            },
        });
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
    const user = yield db_1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user)
        (0, cacheError_1.throwError)('No user found with provided email.., try again', http_status_codes_1.StatusCodes.NOT_FOUND);
    try {
        const resetToken = (0, utils_5.generatePasswordResetToken)();
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 1);
        const password_reset = yield db_1.prisma.passwordResetToken.create({
            data: {
                token: resetToken,
                expirationTime,
                userId: user === null || user === void 0 ? void 0 : user.id,
            },
        });
        yield (0, sendMail_1.sendUserToken)(password_reset, req, res, next);
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
exports.reset_password = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { token } = req === null || req === void 0 ? void 0 : req.params;
    const { password } = req.body;
    try {
        if (!token) {
            (0, cacheError_1.throwError)('Sorry, invalid token or something went wrong', http_status_codes_1.StatusCodes.BAD_GATEWAY);
        }
        if (!password) {
            (0, cacheError_1.throwError)('Please, provide password for reset', http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        const resetTokenData = yield db_1.prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });
        if (!resetTokenData || resetTokenData.expirationTime <= new Date()) {
            (0, cacheError_1.throwError)('Invalid or expired token', http_status_codes_1.StatusCodes.NOT_FOUND);
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        yield db_1.prisma.user.update({
            where: { id: (_b = resetTokenData === null || resetTokenData === void 0 ? void 0 : resetTokenData.user) === null || _b === void 0 ? void 0 : _b.id },
            data: {
                password: hashedPassword,
            },
        });
        yield db_1.prisma.passwordResetToken.delete({
            where: { id: resetTokenData === null || resetTokenData === void 0 ? void 0 : resetTokenData.id },
        });
        res.json({
            message: 'Password reset successful, login now',
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
