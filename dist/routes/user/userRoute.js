"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../../model/user/user.controller");
const userRouter = express_1.default.Router();
userRouter.post("/signup", user_controller_1.create_user);
userRouter.post("/login", user_controller_1.login_user);
userRouter.post("/forget_password", user_controller_1.forgot_password);
userRouter.patch("/reset_password/:token", user_controller_1.reset_password);
exports.default = userRouter;
