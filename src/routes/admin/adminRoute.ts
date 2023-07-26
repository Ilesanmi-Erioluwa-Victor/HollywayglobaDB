import express from "express";
import { adminSignUp } from "../../model/admin/admin.controller";

const adminRouter = express.Router();

adminRouter.post("/admin_signup", adminSignUp);

export default adminRouter;
