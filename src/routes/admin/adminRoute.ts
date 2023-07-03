import express from "express";
import { signUp } from "../../model/admin/admin.controller";

const adminRouter = express.Router();

adminRouter.post("/admin-signup", signUp);

export default adminRouter;
