import express from "express";
import { create_user } from "../../model/user/user.controller";

const userRouter = express.Router();

userRouter.post("/signup", create_user);

export default userRouter;
