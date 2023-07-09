"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authToken_1 = require("./../../middlewares/authToken");
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../../model/user/user.controller");
const userRouter = express_1.default.Router();
userRouter.post('/signup', user_controller_1.create_user);
userRouter.post('/login', user_controller_1.login_user);
// Password rest
userRouter.post('/forget_password_token', user_controller_1.forget_password_token);
userRouter.put('/reset_password', user_controller_1.reset_password);
userRouter.post('/sendmail', authToken_1.AuthMiddleWare, user_controller_1.generate_verification);
userRouter.put('/verify_account', authToken_1.AuthMiddleWare, user_controller_1.account_verification);
userRouter.get('/', authToken_1.AuthMiddleWare, user_controller_1.get_users);
userRouter.get('/:id', user_controller_1.get_user);
userRouter.delete('/:id', user_controller_1.delete_user);
userRouter.put('/password', user_controller_1.update_password);
userRouter.put('/update-profile/:id', user_controller_1.update_user);
exports.default = userRouter;
