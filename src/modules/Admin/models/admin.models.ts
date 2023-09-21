import { signupAdmin } from '../interfaces/admin.interface';

import { prisma } from '../../../configurations/db';

import { Utils } from '../../../helper/utils';

const { accountVerificationToken, generateToken, hashedPassword } = Utils;

export class adminQuery {
  static async findAdminIdM(id: string) {
    const adminId = await prisma.admin.findUnique({
      where: {
        id,
      },
    });
    return adminId;
  }

  static async findAdminEmailM(email: string) {
    const userEmail = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    return userEmail;
  }

  static async createAdminM(admin: signupAdmin) {
    const { name, email, password } = admin;
    const createAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        password: await hashedPassword(password),
      },
    });

    generateToken(createAdmin?.id as string);
    const tokenAdmin = await accountVerificationToken('admin', createAdmin?.id);
    return tokenAdmin;
  }

  static async accountVerificationAdminM(
    id: string,
    accountVerificationToken: string,
    time: Date
  ) {
    const admin = await prisma.admin.findUnique({
      where: {
        id,
        accountVerificationToken,
        accountVerificationTokenExpires: {
          gt: time,
        },
      },
    });

    return admin;
  }

  static async accountVerificationUpdatedAdminM(
    id: string,
    isAccountVerified: boolean,
    accountVerificationToken: string,
    accountVerificationTokenExpires: any
  ) {
    const admin = await prisma.admin.update({
      where: {
        id,
      },
      data: {
        isAccountVerified,
        accountVerificationToken,
        accountVerificationTokenExpires,
      },
    });

    return admin;
  }
}
