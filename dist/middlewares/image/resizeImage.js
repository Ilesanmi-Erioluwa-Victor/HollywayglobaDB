"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multerStorage = multer_1.default.memoryStorage();
const MulterFilter = (req, file, cb) => {
    // check file type
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb({
            message: 'Unsupported file type or format',
        });
    }
};
