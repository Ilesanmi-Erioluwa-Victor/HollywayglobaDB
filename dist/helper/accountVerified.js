"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyAccount = void 0;
const prisma_1 = require("../prisma");
const VerifyAccount = (req, res, next) => {
    const updatedUser = yield prisma_1.prisma.user.update({
        where: {
            id: foundUser.id, // Assuming you have an 'id' field in your 'User' model
        },
        data: {
            isAccountVerified: true,
            accountVerificationToken: '',
            accountVerificationTokenExpires: null, // Set to null or a new date value to clear the expiry
        },
    });
    res.json(updatedUser);
};
exports.VerifyAccount = VerifyAccount;
