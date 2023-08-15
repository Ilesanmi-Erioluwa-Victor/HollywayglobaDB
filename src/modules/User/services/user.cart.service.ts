import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';


export const addToWishlist: RequestHandler = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.authId;
  ValidateMongoDbId(userId as string);

  const { productId, quantity } = req.body;

  try {
    if (!userId || !productId || !quantity)
      next(
        new AppError('Missing required information', StatusCodes.BAD_REQUEST)
      );

    const userWishlistItem = await userWishListM(
      userId as string,
      productId,
      quantity
    );

    res.json({ message: 'Product added to wishlist', data: userWishlistItem });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
