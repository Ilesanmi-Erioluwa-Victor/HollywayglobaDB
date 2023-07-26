import express from "express";
import { adminSignUp, adminSignIn } from '../../model/admin/admin.controller';

const adminRouter = express.Router();

adminRouter.post("/admin_signup", adminSignUp);
adminRouter.post('/admin_login', adminSignIn);
adminRouter.put('/verify_account:token', adminSignIn);

export default adminRouter;
