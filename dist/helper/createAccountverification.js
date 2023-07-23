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
exports.createAccountVerificationToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const prisma_1 = require("../prisma");
function createAccountVerificationToken(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');
        const tokenExpiration = new Date(Date.now() + 30 * 60 * 1000);
        // Assuming you have a model named 'User' with 'accountVerificationToken' and 'accountVerificationTokenExpires' fields
        yield prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                accountVerificationToken: hashedToken,
                accountVerificationTokenExpires: tokenExpiration,
            },
        });
        return verificationToken;
    });
}
exports.createAccountVerificationToken = createAccountVerificationToken;
