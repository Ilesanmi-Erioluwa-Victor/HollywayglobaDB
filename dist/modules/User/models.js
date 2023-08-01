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
exports.updateAddressM = exports.createAddressM = exports.userProfilePictureUpdateM = exports.resetPasswordTokenDeleteM = exports.resetPasswordUpdateM = exports.resetPasswordM = exports.forgetPasswordTokenM = exports.accountVerificationUpdatedM = exports.accountVerificationM = exports.updateUserPasswordM = exports.updateUserM = exports.findUserMEmail = exports.findUserMId = exports.createUserM = void 0;
const db_1 = require("../../configurations/db");
const utils_1 = require("../../helper/utils");
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
const findUserMId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = yield db_1.prisma.user.findUnique({
        where: {
            id,
        },
    });
    return userId;
});
exports.findUserMId = findUserMId;
const findUserMEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const userEmail = yield db_1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    return userEmail;
});
exports.findUserMEmail = findUserMEmail;
const updateUserM = (id, firstName, lastName, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.user.update({
        where: {
            id,
        },
        data: {
            firstName,
            lastName,
            email,
        },
    });
    return user;
});
exports.updateUserM = updateUserM;
const updateUserPasswordM = (id, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.user.update({
        where: {
            id,
        },
        data: {
            password: yield (0, utils_1.hashedPassword)(password),
        },
    });
    return user;
});
exports.updateUserPasswordM = updateUserPasswordM;
const accountVerificationM = (id, accountVerificationToken, time) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.user.findUnique({
        where: {
            id,
            accountVerificationToken,
            accountVerificationTokenExpires: {
                gt: time,
            },
        },
    });
    return user;
});
exports.accountVerificationM = accountVerificationM;
const accountVerificationUpdatedM = (id, isAccountVerified, accountVerificationToken, accountVerificationTokenExpires) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.user.update({
        where: {
            id,
        },
        data: {
            isAccountVerified,
            accountVerificationToken,
            accountVerificationTokenExpires,
        },
    });
    return user;
});
exports.accountVerificationUpdatedM = accountVerificationUpdatedM;
const forgetPasswordTokenM = (token, expirationTime, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.passwordResetToken.create({
        data: {
            token,
            expirationTime,
            userId,
        },
    });
    return user;
});
exports.forgetPasswordTokenM = forgetPasswordTokenM;
const resetPasswordM = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
    });
    return user;
});
exports.resetPasswordM = resetPasswordM;
const resetPasswordUpdateM = (id, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.user.update({
        where: { id },
        data: {
            password: yield (0, utils_1.hashedPassword)(password),
        },
    });
    return user;
});
exports.resetPasswordUpdateM = resetPasswordUpdateM;
const resetPasswordTokenDeleteM = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.passwordResetToken.delete({
        where: { id },
    });
    return user;
});
exports.resetPasswordTokenDeleteM = resetPasswordTokenDeleteM;
const userProfilePictureUpdateM = (id, profilePhoto) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.user.update({
        where: { id },
        data: {
            profilePhoto: profilePhoto,
        },
    });
    return user;
});
exports.userProfilePictureUpdateM = userProfilePictureUpdateM;
const createAddressM = (address, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const userAddress = yield db_1.prisma.address.create({
        data: {
            deliveryAddress: address.deliveryAddress,
            additionalInfo: address.additionalInfo,
            region: address.region,
            city: address.city,
            phone: address.phone,
            additionalPhone: address.additionalPhone,
            user: { connect: { id: userId } },
        },
    });
    return userAddress;
});
exports.createAddressM = createAddressM;
const updateAddressM = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.prisma.address.update({
        where: {
            id,
        },
        data: {
            deliveryAddress: data.deliveryAddress,
            additionalInfo: data.additionalPhone,
            region: data.region,
            city: data.city,
            phone: data.phone,
            additionalPhone: data.additionalInfo,
            user: { connect: { id: id } },
        },
    });
    return user;
});
exports.updateAddressM = updateAddressM;
