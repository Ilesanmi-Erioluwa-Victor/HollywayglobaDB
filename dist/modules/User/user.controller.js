"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_auth_service_1 = require("./services/user.auth.service");
const route = express_1.default.Router();
route.post('/signup', user_auth_service_1.createUser);
route.post('/login', user_auth_service_1.loginUser);
exports.default = route;
