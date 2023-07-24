  import crypto from 'crypto';
  import { prisma } from '../prisma';

  async function createAccountVerificationToken(userId: any) {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    // const hashedToken = crypto
    //   .createHash('sha256')
    //   .update(verificationToken)
    //   .digest('hex');

    const tokenExpiration = new Date(Date.now() + 30 * 60 * 1000);
   const user =  await prisma.user.update({
      where: { id: userId },
      data: {
        accountVerificationToken: verificationToken,
        accountVerificationTokenExpires: tokenExpiration,
      },
   });
    return user;
  }

  export { createAccountVerificationToken };
