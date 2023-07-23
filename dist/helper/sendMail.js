"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendMail = (data, req, res, next) => {
    const { accountVerificationToken, firstName, lastName, email } = data;
    const transport = nodemailer_1.default.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: `${process.env.NODEMAILER_USERNAME}`,
            pass: `${process.env.NODEMAILER_PASS}`,
        },
    });
    const resetUrl = `Kindly use this link to verify your account...
        <a href= ${req.protocol}://${req.get('host')}/api/v1/users/verify_account/${accountVerificationToken}>Click to verify..</a>
       `;
    const mailOptions = {
        from: 'HollwayGlobalIncLimited@gmail.com',
        to: `${email}`,
        subject: 'Account Verification ',
        text: `Hey ${lastName} - ${firstName}, it’s our first message sent with Nodemailer 😉 `,
        html: resetUrl,
    };
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.json(resetUrl);
    });
};
exports.sendMail = sendMail;
