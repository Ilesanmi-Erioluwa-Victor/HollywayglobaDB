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
exports.create_user = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = require("http-status-codes");
const cacheError_1 = require("../../../middlewares/error/cacheError");
const db_1 = require("../../../configurations/db");
const utils_1 = require("../../../helper/utils");
const sendMail_1 = require("../../../templates/sendMail");
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
        (0, utils_1.generateToken)(user === null || user === void 0 ? void 0 : user.id);
        const tokenUser = yield (0, utils_1.createAccountVerificationToken)(user === null || user === void 0 ? void 0 : user.id);
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
