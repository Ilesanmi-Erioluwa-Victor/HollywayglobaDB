"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../../model/admin/admin.controller");
const adminRouter = express_1.default.Router();
adminRouter.post("/admin-signup", admin_controller_1.signUp);
exports.default = adminRouter;
