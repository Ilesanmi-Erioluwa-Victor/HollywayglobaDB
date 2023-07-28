"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_auth_service_1 = require("./services/user.auth.service");
const authToken_1 = require("../../middlewares/auth/authToken");
const route = express_1.default.Router();
route.post('/signup', user_auth_service_1.createUser);
route.post('/login', user_auth_service_1.loginUser);
route.get('/:id', authToken_1.AuthMiddleWare, authToken_1.isUserVerified, user_auth_service_1.getUser);
route.put('/updateProfile/:id', authToken_1.AuthMiddleWare, authToken_1.isUserVerified, user_auth_service_1.updateUser);
route.put('/password/:id', authToken_1.AuthMiddleWare, authToken_1.isUserVerified, user_auth_service_1.updatePassword);
route.put('/:id/verify_account/:token', user_auth_service_1.accountVerification);
exports.default = route;
