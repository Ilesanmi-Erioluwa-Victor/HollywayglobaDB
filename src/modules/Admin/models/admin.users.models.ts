import { prisma } from '../../../configurations/db';

export class adminUserQuery {
  static async getUsersAdminM() {
    const users = await prisma.user.findMany();
    return users;
  }
}
