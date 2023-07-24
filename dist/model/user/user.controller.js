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
exports.reset_password = exports.forget_password_token = exports.account_verification = exports.update_password = exports.update_user = exports.get_user = exports.delete_user = exports.get_users = exports.login_user = exports.create_user = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const cacheError_1 = require("../../middlewares/cacheError");
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = require("../../utils/catchAsync");
const ValidateMongoId_1 = __importDefault(require("../../utils/ValidateMongoId"));
const token_1 = __importDefault(require("../../config/generateToken/token"));
const prisma_1 = require("../../prisma");
const model_user_1 = require("./model.user");
const createAccountverification_1 = require("../../helper/createAccountverification");
const sendMail_1 = require("../../helper/sendMail");
// import { hashedPassword } from '../../helper/hashedPassword';
dotenv_1.default.config();
exports.create_user = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, password, email, mobile } = req.body;
        if (!firstName || !lastName || !password || !email || !mobile)
            return next((0, cacheError_1.throwError)('Missing credentials, please provide all required information', http_status_codes_1.StatusCodes.BAD_REQUEST));
        const exist_user = yield prisma_1.prisma.user.findUnique({ where: { email } });
        if (exist_user) {
            return next((0, cacheError_1.throwError)('You are already a member, kindly login to your account', http_status_codes_1.StatusCodes.CONFLICT));
        }
        // TODO  i will write it to it logic util later
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield prisma_1.prisma.user.create({
            data: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                mobile: mobile,
            },
        });
        (0, token_1.default)(user === null || user === void 0 ? void 0 : user.id);
        const tokenUser = yield (0, createAccountverification_1.createAccountVerificationToken)(user === null || user === void 0 ? void 0 : user.id);
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
exports.login_user = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const exist_user = yield prisma_1.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!exist_user) {
            (0, cacheError_1.throwError)('No user found', http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        if (yield bcryptjs_1.default.compare(password, exist_user.password)) {
            if (!exist_user.isAccountVerified) {
                (0, cacheError_1.throwError)('Verify your account in your gmail before you can log in', http_status_codes_1.StatusCodes.BAD_REQUEST);
            }
            res.json({
                id: exist_user === null || exist_user === void 0 ? void 0 : exist_user.id,
                firstName: exist_user.firstName,
                lastName: exist_user.lastName,
                email: exist_user.email,
                profilePhoto: exist_user.profilePhoto,
                token: (0, token_1.default)(exist_user === null || exist_user === void 0 ? void 0 : exist_user.id),
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
exports.get_users = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.prisma.user.findMany();
        res.json({
            length: users.length,
            users,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.delete_user = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    (0, ValidateMongoId_1.default)(id);
    //TODO i want to write logic to deleted permanently if active
    // is false for two months
    try {
        const deleted_user = yield prisma_1.prisma.user.update({
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
exports.get_user = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    (0, ValidateMongoId_1.default)(id);
    try {
        const user = yield prisma_1.prisma.user.findUnique({
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
exports.update_user = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    (0, ValidateMongoId_1.default)(id);
    const allowedFields = ['firstName', 'lastName', 'email'];
    const unexpectedFields = Object.keys(req.body).filter((field) => !allowedFields.includes(field));
    if (unexpectedFields.length > 0) {
        (0, cacheError_1.throwError)(`Unexpected fields: ${unexpectedFields.join(', ')}, Sorry it's not part of the parameter`, http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    try {
        const userprofile = yield prisma_1.prisma.user.update({
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
exports.update_password = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req === null || req === void 0 ? void 0 : req.params;
        const { password } = req.body;
        (0, ValidateMongoId_1.default)(id);
        // TODO  i will write it to it logic util later
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const user = yield prisma_1.prisma.user.update({
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
// export const generate_verification = catchAsync(
//   async (req: CustomRequest, res: Response, next: NextFunction) => {
//     const { id }: string | any = req?.params;
//     ValidateMongoDbId(id);
//     try {
//       const user: string | any = await prisma.user.findUnique({
//         where: {
//           id,
//         },
//       });
//       createAccountVerificationToken(id);
//       sendMail(user, req, res, next);
//     } catch (error: any) {
//       if (!error.statusCode) {
//         error.statusCode = 500;
//       }
//       next(error);
//     }
//   }
// );
exports.account_verification = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    console.log(token);
    try {
        const user = yield prisma_1.prisma.user.findFirst({
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
        const updatedUser = yield prisma_1.prisma.user.update({
            where: {
                id: user === null || user === void 0 ? void 0 : user.id,
            },
            data: {
                isAccountVerified: true,
                accountVerificationToken: '',
                accountVerificationTokenExpires: null,
            },
        });
        res.json(updatedUser);
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.forget_password_token = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield model_user_1.UserModel.findOne({ email });
    if (!user)
        (0, cacheError_1.throwError)('No user found.., try again', http_status_codes_1.StatusCodes.NOT_FOUND);
    try {
        const token = yield user.createPasswordResetToken();
        yield user.save();
        //   const resetUrl = `If you were requested to reset your account password, reset now, otherwise ignore this message
        //   <a href= ${req.protocol}://${req.get(
        //     'host'
        //   )}/api/v1/users/verifyAccount/${token}>Click to verify..</a>
        //  `;
        // const msg = {
        //   to: email,
        //   from: 'ericjay1452@gmail.com',
        //   subject: 'Verify your email',
        //   html: resetUrl,
        // };
        // const sendMsg = await sgMail.send(msg);
        res.json({
            message: `A successful message has been sent to your gmail`,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
// export const forgot_password: RequestHandler = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const user: string | any = await UserModel.findOne({
//       email: req.body.email,
//     });
//     console.log(user);
//     if (!user)
//       return next(
//         throwError(
//           'Sorry, No user found with this email',
//           StatusCodes.BAD_REQUEST
//         )
//       );
//     try {
//       const resetToken = user.createPasswordResetToken();
//       await user.save({ validateBeforeSave: false });
//       const resetURL = `${req.protocol}://${req.get(
//         'host'
//       )}/api/v1/users/resetPassword/${resetToken}`;
//       const emailjsTemplate = {
//         service_id: 'default_service',
//         template_id: `${process.env.EMAILJS_TEMPLATE_ID}`,
//         user_id: `${process.env.EMAILJS_PUBLIC_KEY}`,
//         accessToken: `${process.env.EMAILJS_PRIVATE_KEY}`,
//         template_params: {
//           name: user?.first_name,
//           message: `Forgot your  password ? make a
//       request with your new password and passwordConfirm to
//        ${resetURL}.\nif you didn't forget your password, please ignore this email`,
//           subject: 'Password reset Token',
//         },
//       };
//       await axios
//         .post('https://api.emailjs.com/api/v1.0/email/send', {
//           data: JSON.stringify(emailjsTemplate),
//           contentType: 'application/json',
//         })
//         .then((response) => console.log(response));
//       res.status(StatusCodes.OK).json({
//         status: 'success',
//         message: 'Token sent to your email',
//       });
//     } catch (error: any) {
//       user.password_reset_token = undefined;
//       user.password_reset_expires = undefined;
//       await user.save({ validateBeforeSave: false });
//       console.log(error);
//       return next(
//         throwError(
//           'There was an error sending Email, try again',
//           StatusCodes.BAD_GATEWAY
//         )
//       );
//     }
//   }
// );
exports.reset_password = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password } = req.body;
    try {
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const user = yield model_user_1.UserModel.findOne({
            password_reset_token: hashedToken,
            password_reset_expires: {
                $gt: Date.now(),
            },
        });
        if (!user) {
            return next((0, cacheError_1.throwError)('Token is invalid or has expired', http_status_codes_1.StatusCodes.BAD_REQUEST));
        }
        yield model_user_1.UserModel.updateOne({
            _id: user._id,
        }, {
            $set: {
                password,
                password_reset_token: '',
                password_reset_expires: '',
            },
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
