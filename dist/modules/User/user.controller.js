"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_auth_service_1 = require("./services/user.auth.service");
const authToken_1 = require("../../middlewares/auth/authToken");
// import { upload } from '../../helper/utils';
const resizeImage_1 = require("../../middlewares/image/resizeImage");
const route = express_1.default.Router();
route.post('/signup', user_auth_service_1.createUser);
route.post('/login', user_auth_service_1.loginUser);
route.post('/:id/address/create', authToken_1.AuthMiddleWare, authToken_1.isUserVerified, user_auth_service_1.createAddress);
// route.put(
//   '/:id/address/edit',
//   AuthMiddleWare,
//   isUserVerified,
//   editAddress
// );
route.post('/forgetPassword', user_auth_service_1.forgetPasswordToken);
route.put('/resetPassword/:token', user_auth_service_1.resetPassword);
route.get('/:id', authToken_1.AuthMiddleWare, authToken_1.isUserVerified, user_auth_service_1.getUser);
route.put('/updateProfile/:id', authToken_1.AuthMiddleWare, authToken_1.isUserVerified, user_auth_service_1.updateUser);
route.post('/:id/uploadImage', authToken_1.AuthMiddleWare, resizeImage_1.profileImage.single('image'), resizeImage_1.profileImageResize, authToken_1.isUserVerified, user_auth_service_1.uploadProfile);
route.put('/password/:id', authToken_1.AuthMiddleWare, authToken_1.isUserVerified, user_auth_service_1.updatePassword);
route.put('/:id/verify_account/:token', user_auth_service_1.accountVerification);
exports.default = route;
