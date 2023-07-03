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
const dotenv_1 = __importDefault(require("dotenv"));
const cacheError_1 = require("../../middlewares/cacheError");
const http_status_codes_1 = require("http-status-codes");
const model_user_1 = require("./model.user");
const catchAsync_1 = require("../../utils/catchAsync");
dotenv_1.default.config();
exports.create_user = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, password, email } = req.body;
    const exist_user = yield model_user_1.userModel.findOne({ email });
    const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
    if (exist_user)
        (0, cacheError_1.throwError)("You are already a member, kindly login to your account", http_status_codes_1.StatusCodes.CONFLICT);
    const user = yield model_user_1.userModel.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
    });
    yield user.save();
    res.status(http_status_codes_1.StatusCodes.CREATED).json({
        message: "You have successfully created your account, log in now",
        status: "success",
        userId: user === null || user === void 0 ? void 0 : user._id
    });
}));
