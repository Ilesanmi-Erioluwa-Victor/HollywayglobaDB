import { prisma } from '../../../configurations/db';

import { address } from '../user.interface';

export class addressQueries {
  static async createAddressM(address: address, userId: string) {
    const userAddress = await prisma.address.create({
      data: {
        deliveryAddress: address.deliveryAddress,
        additionalInfo: address.additionalInfo,
        region: address.region,
        city: address.city,
        phone: address.phone,
        additionalPhone: address.additionalPhone,
        user: { connect: { id: userId } },
      },
    });
    return userAddress;
  }

  static async updateAddressM(id: string, data: address) {
    const updatedAddress = await prisma.address.update({
      where: { id: id },
      data: data,
    });

    return updatedAddress;
  }

  static async findUserWithAddressM(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: { address: true },
    });
    return user;
  }

  static async findAddressM(id: string) {
    const address = await prisma.address.findUnique({
      where: {
        id,
      },
    });
    return address;
  }

  static async findAddressesByUserId(userId: string) {
    const addresses = await prisma.address.findMany({
      where: {
        userId: userId,
      },
    });

    return addresses;
  }

  static async findUserWithAddressAndDeleteM(addressId: string) {
    const address = await prisma.address.delete({
      where: {
        id: addressId,
      },
    });
    return address;
  }
}
