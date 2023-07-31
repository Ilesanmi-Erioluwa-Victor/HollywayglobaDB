import { v2 as cloudinary } from 'cloudinary';
import { ENV } from '../config';
import { catchAsync } from '../../helper/utils';

cloudinary.config({
  cloud_name: ENV.CLOUDIANRY.NAME,
  api_key: ENV.CLOUDIANRY.KEY,
  api_secret: ENV.CLOUDIANRY.SECRET,
});

export const cloudinaryUploadImage = catchAsync(
  async (file: string) => {
    try {
      const data = await cloudinary.uploader.upload(file, {
        resource_type: 'auto',
      });
      return {
        url: data?.secure_url,
      };
    } catch (error) {
      return error;
    }
  }
);
