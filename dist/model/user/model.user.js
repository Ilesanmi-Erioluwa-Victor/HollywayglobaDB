"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const userSchema = new mongoose_1.Schema({
    firstName: {
        required: [true, 'First name is required'],
        type: String,
    },
    lastName: {
        required: [true, 'Last name is required'],
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    profilePhoto: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png',
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    accountVerificationToken: {
        type: String,
    },
    accountVerificationTokenExpires: {
        type: Date,
    },
    passwordChangeAt: {
        type: Date,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
    active: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            next();
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    });
});
userSchema.statics.emailTaken = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email });
        return !!user;
    });
};
userSchema.methods.createAccountVerificationToken =
    function () {
        return __awaiter(this, void 0, void 0, function* () {
            const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
            this.accountVerificationToken = crypto_1.default
                .createHash('sha256')
                .update(verificationToken)
                .digest('hex');
            this.accountVerificationTokenExpires = Date.now() + 30 * 60 * 1000;
            console.log(verificationToken);
            return verificationToken;
        });
    };
userSchema.methods.isPasswordMatched = function (userPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcryptjs_1.default.compare(userPassword, this.password);
    });
};
userSchema.methods.createPasswordResetToken =
    function () {
        return __awaiter(this, void 0, void 0, function* () {
            const resetToken = crypto_1.default.randomBytes(32).toString('hex');
            this.passwordResetToken = crypto_1.default
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');
            this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
            return resetToken;
        });
    };
exports.UserModel = mongoose_1.default.model('User', userSchema);
