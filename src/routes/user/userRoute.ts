import express from "express";
import { create_user, login_user, forgot_password,reset_password, get_users, delete_user } from "../../model/user/user.controller";

const userRouter = express.Router();

userRouter.post("/signup", create_user);
userRouter.post("/login", login_user)

userRouter.get('/', get_users);
userRouter.delete('/:id', delete_user);
userRouter.post("/forget_password",forgot_password);
userRouter.patch("/reset_password/:token",reset_password);

export default userRouter;
