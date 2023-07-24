import crypto from 'crypto';
import { prisma } from '../prisma';
import generateToken from '../config/generateToken/token';

async function createAccountVerificationToken(userId: any) {
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const tokenExpiration = new Date(Date.now() + 30 * 60 * 1000);
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      accountVerificationToken: verificationToken,
      accountVerificationTokenExpires: tokenExpiration,
    },
  });
  return user;
}

export { createAccountVerificationToken };
