import crypto from 'crypto';
import { prisma } from '../prisma';

async function createAccountVerificationToken(userId:string, token: string, expiresIn: Date) {
  
  await prisma.user.update({
    where: { id: userId },
    data: {
      accountVerificationToken: token,
      accountVerificationTokenExpires: expiresIn,
    },
  });
  // return verificationToken;
}

export { createAccountVerificationToken };
