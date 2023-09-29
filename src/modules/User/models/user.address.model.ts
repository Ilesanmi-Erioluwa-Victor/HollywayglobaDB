import { prisma } from '../../../configurations/db';

import { address } from '../user.interface';

export class addressQuery {
  static async createAddressM(address: address, userId: string) {
    const Address = await prisma.address.create({
      data: {
        deliveryAddress: address.deliveryAddress,
        additionalInfo: address.additionalInfo,
        region: address.region,
        city: address.city,
        phone: address.phone,
        additionalPhone: address.additionalPhone,
        country: address.country,

        user: { connect: { id: userId } },
      },
    });
    return Address;
  }

  static async updateAddressM(id: string, data: address) {
    const updatedAddress = await prisma.address.update({
      where: { id: id },
      data: data,
    });

    return updatedAddress;
  }

  static async countUserAddresses(userId: string) {
    const count = await prisma.address.count({
      where: {
        userId: userId,
      },
    });
    return count;
  }

  static async findAddressM(id: string) {
    const address = await prisma.address.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        country: true,
        city: true,
        additionalInfo: true,
        phone: true,
        deliveryAddress: true,
        isDefault: true,
        additionalPhone: true,
        userId: true,
      },
    });
    return address;
  }

  static async findAddressesByUserId(userId: string) {
    const addresses = await prisma.address.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        deliveryAddress: true,
        additionalInfo: true,
        region: true,
        city: true,
        phone: true,
        additionalPhone: true,
        userId: false,
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
