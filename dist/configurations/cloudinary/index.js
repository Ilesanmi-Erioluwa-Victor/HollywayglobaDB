"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryUploadImage = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = require("../config");
cloudinary_1.v2.config({
    cloud_name: config_1.ENV.CLOUDIANRY.NAME,
    api_key: config_1.ENV.CLOUDIANRY.KEY,
    api_secret: config_1.ENV.CLOUDIANRY.SECRET,
});
const cloudinaryUploadImage = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield cloudinary_1.v2.uploader.upload(file, {
            resource_type: 'auto',
        });
        return {
            url: data === null || data === void 0 ? void 0 : data.secure_url,
        };
    }
    catch (error) {
        return error;
    }
});
exports.cloudinaryUploadImage = cloudinaryUploadImage;
