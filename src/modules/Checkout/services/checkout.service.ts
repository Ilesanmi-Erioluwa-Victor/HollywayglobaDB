import { NextFunction, Response, Request } from 'express';
const Flutterwave = require('flutterwave-node-v3');
const Flutterwave2 = require('flutterwave-node');
import { ORDER_STATUS } from '@prisma/client';

import { prisma } from '../../../configurations/db';

export const Checkout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: req.body.orderId,
        userId: req.user.userId,
      },
    });
      
      const user = await prisma.user.findUnique({
          where : {
            id : req.user.userId
          }
      })
    
    const details = {
        account_bank: "044",
        account_number: "0690000040",
        amount: order?.total_amount,
        narration: "Payment for things",
        currency: "NGN",
        reference: order?.id,
        callback_url: "https://webhook.site/b3e505b0-fe02-430e-a538-22bbbce8ce0d",
        debit_currency: "NGN"
    };

    const flw = new Flutterwave2(
      'FLWPUBK_TEST-834019d2165f6aeac899b1e78e7ebf12-X',
      'FLWSECK_TEST-20a7e0f2fb60b5c406d8dcd7e961b6c6-X'
    );

   const payment = await flw.Transfer.initiate(details);
    
    res.json({ payment });
  } catch (error: any) {
    throw error;
  }
};
