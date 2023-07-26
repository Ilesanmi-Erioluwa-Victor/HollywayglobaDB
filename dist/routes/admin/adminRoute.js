"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../../model/admin/admin.controller");
const adminRouter = express_1.default.Router();
adminRouter.post("/admin_signup", admin_controller_1.adminSignUp);
adminRouter.post('/admin_login', admin_controller_1.adminSignIn);
adminRouter.put('/verify_account/:token', admin_controller_1.adminAccount_Verification);
exports.default = adminRouter;
