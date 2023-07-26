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
exports.sendUserToken = exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const db_1 = require("../configurations/db");
const config_1 = require("../configurations/config");
const sendMail = (data, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = await prisma.user.findUnique({})
    const { accountVerificationToken, firstName, lastName, email } = data;
    const transport = nodemailer_1.default.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: `${config_1.ENV.NODEMAILER.USERNAME}`,
            pass: `${config_1.ENV.NODEMAILER.PASSWORD}`,
        },
    });
    const resetUrl = `Kindly use this link to verify your account...
        <a href= ${req.protocol}://${req.get('host')}/api/v1/user/verify_account/${accountVerificationToken}>Click to verify..</a>
       `;
    const mailOptions = {
        from: 'HollwayGlobalIncLimited@gmail.com',
        to: `${email}`,
        subject: 'Account Verification ',
        text: `Hey ${lastName} - ${firstName}, Please verify your account by clicking the link below: 😉 `,
        html: resetUrl,
    };
    yield transport.sendMail(mailOptions);
});
exports.sendMail = sendMail;
const sendUserToken = (data, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data);
    const user = yield db_1.prisma.user.findUnique({
        where: {
            id: data === null || data === void 0 ? void 0 : data.userId,
        },
    });
    console.log(user);
    const transport = nodemailer_1.default.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: `${config_1.ENV.NODEMAILER.USERNAME}`,
            pass: `${config_1.ENV.NODEMAILER.PASSWORD}`,
        },
    });
    const resetUrl = `Kindly use this link to verify your account...
        <a href= ${req.protocol}://${req.get('host')}/api/v1/user/reset_password/${data === null || data === void 0 ? void 0 : data.token}>Click here to reset your password..</a>
       `;
    const mailOptions = {
        from: 'HollwayGlobalIncLimited@gmail.com',
        to: `${user === null || user === void 0 ? void 0 : user.email}`,
        subject: 'Password Reset Token',
        text: `Your password reset token 😉 `,
        html: resetUrl,
    };
    yield transport.sendMail(mailOptions);
});
exports.sendUserToken = sendUserToken;
