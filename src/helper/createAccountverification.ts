import crypto from 'crypto';
import { prisma } from '../prisma';

async function createAccountVerificationToken(userId: any): Promise<string> {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    const tokenExpiration = new Date(Date.now() + 30 * 60 * 1000);

    // Assuming you have a model named 'User' with 'accountVerificationToken' and 'accountVerificationTokenExpires' fields
    await prisma.user.update({
        where: { id: userId },
        data: {
            accountVerificationToken: hashedToken,
            accountVerificationTokenExpires: tokenExpiration,
        },
    });

    return verificationToken;
}

export { createAccountVerificationToken };
