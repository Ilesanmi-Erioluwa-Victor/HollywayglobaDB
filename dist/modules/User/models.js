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
exports.createUserM = exports.findUserM = void 0;
const db_1 = require("../../configurations/db");
const utils_1 = require("../../helper/utils");
const findUserM = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, email } = user;
    if (id) {
        return yield db_1.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }
    if (email) {
        return yield db_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
});
exports.findUserM = findUserM;
const createUserM = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, mobile, password } = user;
    const createUser = yield db_1.prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            mobile,
            password: yield (0, utils_1.hashedPassword)(password),
        },
    });
    (0, utils_1.generateToken)(createUser === null || createUser === void 0 ? void 0 : createUser.id);
    const tokenUser = yield (0, utils_1.createAccountVerificationToken)(createUser === null || createUser === void 0 ? void 0 : createUser.id);
    return tokenUser;
});
exports.createUserM = createUserM;
