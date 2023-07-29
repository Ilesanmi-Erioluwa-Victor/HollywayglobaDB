"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cacheError_1 = require("../middlewares/cacheError");
const http_status_codes_1 = require("http-status-codes");
const ValidateMongoDbId = (id) => {
    const isValidId = mongoose_1.default.Types.ObjectId.isValid(id);
    if (!isValidId)
        (0, cacheError_1.throwError)('Invalid Id passed, check your Id', http_status_codes_1.StatusCodes.BAD_REQUEST);
};
exports.default = ValidateMongoDbId;
