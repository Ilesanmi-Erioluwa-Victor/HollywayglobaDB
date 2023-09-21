export const getUsersAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    ValidateMongoDbId(id);
    try {
      if (!id)
        next(new AppError('No Admin record found', StatusCodes.BAD_REQUEST));
      const users = await getUsersAdminM();
      res.json({
        length: users.length,
        users,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
