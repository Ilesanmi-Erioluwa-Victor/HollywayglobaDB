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
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendVerificationEmail = (data, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const transport = nodemailer_1.default.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: `${process.env.NODEMAILER_USERNAME}`,
            pass: `${process.env.NODEMAILER_PASS}`,
        },
    });
    const verificationLink = `${req.protocol}://${req.get('host')}/api/v1/users/verify_account/${data === null || data === void 0 ? void 0 : data.verificationToken}`;
    const mailOptions = {
        from: 'HollwayGlobalIncLimited@gmail.com',
        to: data === null || data === void 0 ? void 0 : data.email,
        subject: 'Account Verification',
        text: 'Please verify your account by clicking the link below:',
        html: `<a href="${verificationLink}">Click to verify your account</a>`,
    };
    yield transport.sendMail(mailOptions);
});
exports.sendVerificationEmail = sendVerificationEmail;
