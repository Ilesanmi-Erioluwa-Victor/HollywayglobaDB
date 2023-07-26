import express from "express";
import { adminSignUp } from "../../model/admin/admin.controller";

const adminRouter = express.Router();

adminRouter.post("/admin-signup", adminSignUp);

export default adminRouter;
