import { RequestHandler, NextFunction, Request, Response } from 'express';

import { Utils } from '../../../helper/utils';

import { addressQuery } from '../models/user.address.model';

const { catchAsync } = Utils;

import { userQuery } from '../models/user.model';

import { prisma } from '../../../configurations/db';

import {
  BadRequestError,
  Forbidden,
  NotFoundError,
} from '../../../errors/customError';

const { findUserMId } = userQuery;

const {
  createAddressM,
  findAddressesByUserId,
  countUserAddresses,
  updateAddressM,
  findUserWithAddressAndDeleteM,
  findAddressM,
} = addressQuery;

export const createAddress: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const addressCount = await countUserAddresses(req.params.id);

    if (addressCount >= 4)
      throw new Forbidden('Maximum number of addresses reached. 4');

    const user = await createAddressM(req.body, req.params.id);

    if (!user) throw new NotFoundError('no user found');

    res.json({
      status: 'success',
      message: 'ok',
    });
  }
);

export const editAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const existingAddress = await findAddressM(req.params.addressId);

    if (!existingAddress) throw new NotFoundError('no address found');

    const updatedAddress = await updateAddressM(req.params.addressId, req.body);

    if (!updatedAddress)
      throw new BadRequestError('something went wrong, try again');

    res.json({
      status: 'success',
      message: 'ok',
    });
  }
);

export const getAddresses = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const addresses = await findAddressesByUserId(req.params.id);

    if (!addresses) throw new NotFoundError('no addresses found');

    res.json({
      status: 'success',
      message: 'ok',
      data: addresses,
    });
  }
);

export const getAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const address = await findAddressM(req.params.addressId);

    if (!address) throw new NotFoundError('no addresses found');

    res.json({
      status: 'success',
      message: 'ok',
      data: address,
    });
  }
);

export const deleteAddress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const address = await findUserWithAddressAndDeleteM(req.params.addressId);

    if (!address) throw new NotFoundError('no address found');

    res.json({
      status: 'success',
      message: 'address deleted',
    });
  }
);
