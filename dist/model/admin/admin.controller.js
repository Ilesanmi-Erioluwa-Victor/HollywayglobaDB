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
exports.signUp = void 0;
const http_status_codes_1 = require("http-status-codes");
const utils_1 = require("../../helper/utils");
const cacheError_1 = require("../../middlewares/error/cacheError");
exports.signUp = (0, utils_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        if (yield (AdminModel === null || AdminModel === void 0 ? void 0 : AdminModel.emailTaken(email)))
            (0, cacheError_1.throwError)('You are already an admin, please,kindly log into your account', http_status_codes_1.StatusCodes.CONFLICT);
        const admin = AdminModel.create({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
        });
        res.status(201).json({
            message: 'admin account created successfully',
            status: 'Success',
        });
    }
    catch (error) {
        next(error);
    }
}));
// export const login: RequestHandler = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { email, password } = req.body;
//     try {
//       const admin = await AdminModel.findOne({ email: email });
//       // if (admin && (await admin.isPasswordMatched(password))) {
//       //   res.json({
//       //     _id: admin?._id,
//       //     token: generateToken(admin?._id),
//       //   });
//       // } else {
//       //   res.status(401); throwError(`Login Failed, invalid credentials..`, StatusCodes.BAD_REQUEST);
//       // }
//     } catch (error) {}
//   }
// );
