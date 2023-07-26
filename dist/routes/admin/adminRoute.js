"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../../model/admin/admin.controller");
const authToken_1 = require("../../middlewares/auth/authToken");
const adminRouter = express_1.default.Router();
adminRouter.post("/admin_signup", admin_controller_1.adminSignUp);
adminRouter.post('/admin_login', admin_controller_1.adminSignIn);
adminRouter.put('/verify_account/:token', admin_controller_1.adminAccount_Verification);
adminRouter.get('/users/:id', authToken_1.AuthMiddleWare, authToken_1.adminRole, admin_controller_1.get_users);
exports.default = adminRouter;
