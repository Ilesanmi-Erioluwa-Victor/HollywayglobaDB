import { v2 as cloudinary } from 'cloudinary';
import { ENV } from '../config';
import  multer from "multer"

cloudinary.config({
  cloud_name: ENV.CLOUDIANRY.NAME,
  api_key: ENV.CLOUDIANRY.KEY,
  api_secret: ENV.CLOUDIANRY.SECRET,
});

export const cloudinaryUploadImage = async (file: string, folder: string) => {
  try {
    const data = await cloudinary.uploader.upload(file, {
      resource_type: 'auto',
      folder: `Hollway/${folder}`
    });
    return {
      url: data?.secure_url,
    };
  } catch (error) {
    return error;
  }
};

