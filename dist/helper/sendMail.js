"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = () => {
    var transport = nodemailer_1.default.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: `${process.env.NODEMAILER_USERNAME}`,
            pass: `${process.env.NODEMAILER_PASS}`,
        },
    });
};
exports.sendMail = sendMail;
