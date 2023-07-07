import mongoose from 'mongoose';
import { throwError } from '../middlewares/cacheError';
import { StatusCodes } from 'http-status-codes';


const ValidateMongoDbId = (id: string) => {
  const isValidId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidId) throwError('Invalid Id passed, check your Id', StatusCodes.BAD_REQUEST);
};

export default ValidateMongoDbId;
