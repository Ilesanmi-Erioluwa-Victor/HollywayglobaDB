import { prisma } from "../../../configurations/db";

import { address } from "../user.interface";

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
    const user = await prisma.address.update({
      where: {
        id,
      },
      data: {
        deliveryAddress: data.deliveryAddress,
        additionalInfo: data.additionalInfo,
        region: data.region,
        city: data.city,
        phone: data.phone,
        additionalPhone: data.additionalPhone,
      },
    });

    return user;
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
