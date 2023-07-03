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
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signUp = void 0;
const model_admin_1 = require("./model.admin");
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = require("../../utils/catchAsync");
const cacheError_1 = require("../../middlewares/cacheError");
exports.signUp = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        if (yield (model_admin_1.AdminModel === null || model_admin_1.AdminModel === void 0 ? void 0 : model_admin_1.AdminModel.emailTaken(email)))
            (0, cacheError_1.throwError)("You are already an admin, please,kindly log into your account", http_status_codes_1.StatusCodes.CONFLICT);
        const admin = model_admin_1.AdminModel.create({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
        });
        res.status(201).json({
            message: "admin account created successfully",
            status: "Success"
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.login = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const admin = yield model_admin_1.AdminModel.findOne({ email: email });
        if (admin && (yield admin.isPasswordMatched(password))) {
            res.json({
                _id: admin === null || admin === void 0 ? void 0 : admin._id,
                token: generateToken(admin === null || admin === void 0 ? void 0 : admin._id),
            });
        }
        else {
            res.status(401);
            (0, cacheError_1.throwError)(`Login Failed, invalid credentials..`, http_status_codes_1.StatusCodes.BAD_REQUEST);
        }
        try { }
        catch (error) {
        }
    }
    finally { }
}));
