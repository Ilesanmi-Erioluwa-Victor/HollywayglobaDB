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
exports.generateToken = exports.generatePasswordResetToken = exports.createAccountVerificationToken = exports.ValidateMongoDbId = exports.catchAsync = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const cacheError_1 = require("../middlewares/error/cacheError");
const http_status_codes_1 = require("http-status-codes");
const db_1 = require("../configurations/db");
const config_1 = require("../configurations/config");
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => next(err));
    };
};
exports.catchAsync = catchAsync;
const ValidateMongoDbId = (id) => {
    const isValidId = mongoose_1.default.Types.ObjectId.isValid(id);
    if (!isValidId)
        (0, cacheError_1.throwError)('Invalid Id passed, check your Id', http_status_codes_1.StatusCodes.BAD_REQUEST);
};
exports.ValidateMongoDbId = ValidateMongoDbId;
const createAccountVerificationToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
    const tokenExpiration = new Date(Date.now() + 30 * 60 * 1000);
    const user = yield db_1.prisma.user.update({
        where: { id: userId },
        data: {
            accountVerificationToken: verificationToken,
            accountVerificationTokenExpires: tokenExpiration,
        },
    });
    return user;
});
exports.createAccountVerificationToken = createAccountVerificationToken;
function generatePasswordResetToken() {
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);
    return resetToken;
}
exports.generatePasswordResetToken = generatePasswordResetToken;
const generateToken = (id) => {
    if (!config_1.ENV.JWT.SECRET)
        (0, cacheError_1.throwError)('JWT_KEY is required in environment', http_status_codes_1.StatusCodes.BAD_REQUEST);
    const token = jsonwebtoken_1.default.sign({ id }, `${config_1.ENV.JWT.SECRET}`, {
        expiresIn: `${config_1.ENV.JWT.EXPIRES}`,
    });
    return token;
};
exports.generateToken = generateToken;
