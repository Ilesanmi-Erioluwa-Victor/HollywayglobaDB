import express from "express";
import { create_user, login_user, forgot_password } from "../../model/user/user.controller";

const userRouter = express.Router();

userRouter.post("/signup", create_user);
userRouter.post("/login", login_user)

userRouter.post("/forget_password",forgot_password);

export default userRouter;