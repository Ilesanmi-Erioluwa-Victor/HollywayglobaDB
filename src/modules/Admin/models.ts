import { prisma } from '../../configurations/db';
import {
    hashedPassword,
    generatePasswordResetToken,
  generateToken,
  createAccountVerificationTokenAdmin,
} from '../../helper/utils';

export const findAdminIdM = async (adminId: string) => {
    const adminId = await prisma.admin.findUnique({
        
    })
}
export const createAdminM = async (admin: ) => {
    
}
