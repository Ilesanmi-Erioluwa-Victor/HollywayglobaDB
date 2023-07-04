import express from "express";
import { create_user, login_user } from "../../model/user/user.controller";

const userRouter = express.Router();

userRouter.post("/signup", create_user);
userRouter.post("/login", login_user)

export default userRouter;
