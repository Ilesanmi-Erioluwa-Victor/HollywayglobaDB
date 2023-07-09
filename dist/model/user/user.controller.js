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
exports.reset_password = exports.forget_password_token = exports.account_verification = exports.generate_verification = exports.update_password = exports.update_user = exports.get_user = exports.delete_user = exports.get_users = exports.login_user = exports.create_user = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
const cacheError_1 = require("../../middlewares/cacheError");
const http_status_codes_1 = require("http-status-codes");
const model_user_1 = require("./model.user");
const catchAsync_1 = require("../../utils/catchAsync");
const ValidateMongoId_1 = __importDefault(require("../../utils/ValidateMongoId"));
const token_1 = __importDefault(require("../../config/generateToken/token"));
dotenv_1.default.config();
exports.create_user = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, password, email } = req.body;
        if (!firstName || !lastName || !password || !email)
            return next((0, cacheError_1.throwError)('Missing credentials, please provide all required information', http_status_codes_1.StatusCodes.BAD_REQUEST));
        const exist_user = yield model_user_1.UserModel.findOne({ email });
        if (exist_user) {
            return next((0, cacheError_1.throwError)('You are already a member, kindly login to your account', http_status_codes_1.StatusCodes.CONFLICT));
        }
        const user = yield model_user_1.UserModel.create({
            firstName,
            lastName,
            email,
            password,
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            message: 'You have successfully created your account, log in now',
            status: 'success',
            user
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
        const exist_user = yield model_user_1.UserModel.findOne({ email });
        if (exist_user && (yield exist_user.isPasswordMatched(password))) {
            res.json({
                // _id: exist_user?._id,
                // firstName: exist_user?.firstName,
                // lastName: exist_user?.lastName,
                // email: exist_user?.email,
                // profilePhoto: exist_user?.profilePhoto,
                exist_user,
                token: (0, token_1.default)(exist_user === null || exist_user === void 0 ? void 0 : exist_user._id),
            });
        }
        else {
            res.status(401);
            next((0, cacheError_1.throwError)(`Login Failed, invalid credentials..`, http_status_codes_1.StatusCodes.NOT_FOUND));
        }
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
// export const protect: RequestHandler = catchAsync(
//   async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//     try {
//       let token;
//       if (
//         req.headers.authorization &&
//         req.headers.authorization.startsWith('Bearer')
//       ) {
//         token = req.headers.authorization.split(' ')[1];
//       }
//       if (!token) {
//         return next(
//           throwError('You are not logged in! Please log in to get access.', 401)
//         );
//       }
//       //  Verification token
//       const decoded: any = jwt.verify(
//         token,
//         `${process.env.JWT_SERCRET_KEY}`,
//         (err, decoded) => {
//           if (err) return next(throwError(`${err}`, StatusCodes.BAD_REQUEST));
//           return decoded;
//         }
//       );
//       const current_user = await UserModel.findById(decoded?.id);
//       if (!current_user) {
//         return next(
//           throwError(
//             'The user belonging to this token does no longer exist.',
//             StatusCodes.BAD_REQUEST
//           )
//         );
//       }
//       // ) Check if user changed password after the token was issued
//       if (current_user.changePasswordAfter(decoded.iat)) {
//         return next(
//           throwError(
//             'User recently changed password! Please log in again.',
//             StatusCodes.BAD_REQUEST
//           )
//         );
//       }
//       // GRANT ACCESS TO PROTECTED ROUTE
//       req.user = current_user;
//       next();
//     } catch (error: any) {
//       if (!error.statusCode) {
//         error.statusCode = 500;
//       }
//       next(error);
//     }
//   }
// );
exports.get_users = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield model_user_1.UserModel.find({});
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
    try {
        const deleted_user = yield model_user_1.UserModel.findByIdAndDelete(id);
        res.json({
            message: 'You have successfully deleted this user',
            user: deleted_user,
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
        const user = yield model_user_1.UserModel.findById(id);
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
    const _id = req === null || req === void 0 ? void 0 : req.authId;
    (0, ValidateMongoId_1.default)(_id);
    try {
        const userprofile = yield model_user_1.UserModel.findByIdAndUpdate(_id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        }, { new: true, runValidators: true });
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
        const _id = req === null || req === void 0 ? void 0 : req.authId;
        const { password } = req.body;
        (0, ValidateMongoId_1.default)(_id);
        const user = yield model_user_1.UserModel.findById(_id);
        if (password) {
            const updatedUser = yield (user === null || user === void 0 ? void 0 : user.save());
            res.json(updatedUser);
        }
        else {
            res.json(user);
        }
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.generate_verification = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req === null || req === void 0 ? void 0 : req.params);
    const login_user_id = req === null || req === void 0 ? void 0 : req.authId;
    const user = yield model_user_1.UserModel.findById(login_user_id);
    try {
        const verificationToken = yield (user === null || user === void 0 ? void 0 : user.createAccountVerificationToken());
        yield (user === null || user === void 0 ? void 0 : user.save());
        console.log(user, verificationToken);
        var transport = nodemailer_1.default.createTransport({
            host: 'sandbox.smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: `${process.env.NODEMAILER_USERNAME}`,
                pass: `${process.env.NODEMAILER_PASS}`,
            },
        });
        const resetUrl = `If you were requested to reset your account password, reset now, otherwise ignore this message
        <a href= ${req.protocol}://${req.get('host')}/api/v1/users/verifyAccount/${verificationToken}>Click to verify..</a>
       `;
        const mailOptions = {
            from: 'ifedayo1452@gmail.com',
            to: 'ericjay1452@gmail.com',
            subject: 'Account Verification ',
            text: 'Hey there, it’s our first message sent with Nodemailer 😉 ',
            html: resetUrl,
        };
        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}));
exports.account_verification = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    try {
        const hashToken = crypto_1.default
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const found_user = yield model_user_1.UserModel.findOne({
            accountVerificationToken: hashToken,
            accountVerificationTokenExpires: { $gt: new Date() },
        });
        if (!found_user)
            (0, cacheError_1.throwError)('Token expired, try agin...', http_status_codes_1.StatusCodes.BAD_REQUEST);
        found_user.isAccountVerified = true;
        found_user.accountVerificationToken = '';
        found_user.accountVerificationTokenExpires = '';
        yield found_user.save();
        res.json(found_user);
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
