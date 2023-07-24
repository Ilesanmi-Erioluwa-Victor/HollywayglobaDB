import crypto from 'crypto';

function generatePasswordResetToken(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 1);

  return resetToken;
}

export default generatePasswordResetToken;
