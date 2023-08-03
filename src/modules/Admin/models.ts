import { prisma } from '../../configurations/db';
import {
    hashedPassword,
    generatePasswordResetToken,
  generateToken,
  createAccountVerificationTokenAdmin,
} from '../../helper/utils';

export const findAdminIdM = async (id: string) => {
    const adminId = await prisma.admin.findUnique({
        where: {
        id
    }
    })
    return adminId;
}

export const findAdminEmailM = async (email: string) => {
  const userEmail = await prisma.admin.findUnique({
    where: {
      email,
    },
  });

  return userEmail;
};

export const createAdminM = async (admin: ) => {
    
}
