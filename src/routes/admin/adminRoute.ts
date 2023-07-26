import express from "express";
import { adminSignUp, adminSignIn,get_users, adminAccount_Verification } from '../../model/admin/admin.controller';
import { adminRole, AuthMiddleWare } from "../../middlewares/auth/authToken";

const adminRouter = express.Router();

adminRouter.post("/admin_signup", adminSignUp);
adminRouter.post('/admin_login', adminSignIn);
adminRouter.put('/verify_account/:token', adminAccount_Verification);

adminRouter.get('/users/:id', AuthMiddleWare, adminRole, get_users);
export default adminRouter;
