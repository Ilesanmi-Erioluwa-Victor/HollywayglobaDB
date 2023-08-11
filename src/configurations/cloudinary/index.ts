import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ENV } from '../config';
import multer from 'multer';

export class CloudinaryUploader {
  constructor() {
    cloudinary.config({
      cloud_name: ENV.CLOUDIANRY.NAME,
      api_key: ENV.CLOUDIANRY.KEY,
      api_secret: ENV.CLOUDIANRY.SECRET,
    });
  }

  async uploadImage(file: string, folder: string): Promise<string | undefined> {
    try {
      const data: UploadApiResponse = await cloudinary.uploader.upload(file, {
        resource_type: 'auto',
        folder: `Hollway/${folder}`,
      });
      return data?.secure_url;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}

