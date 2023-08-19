import { prisma } from '../../../configurations/db';

import { Utils } from '../../../helper/utils';

import { address} from '../user.interface';

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
}
