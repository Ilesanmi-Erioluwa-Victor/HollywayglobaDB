import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ENV } from '../config';
import sharp from 'sharp';
import multer from 'multer';

class CloudinaryUploader {
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

class ImageProcessor {
  private uploader: CloudinaryUploader;

  constructor() {
    this.uploader = new CloudinaryUploader();
  }

  async processImages(files: Express.Multer.File[]): Promise<string[]> {
    const imagePromises: Promise<string | undefined>[] = files.map(
      async (file: Express.Multer.File) => {
        const resizedImage = await sharp(file.buffer)
          .resize({ fit: 'inside', width: 2000, height: 2000 })
          .toBuffer();

        return new Promise<string | undefined>((resolve) => {
          cloudinary.uploader
            .upload_stream((error, result: UploadApiResponse) => {
              if (error) {
                console.error(error);
                resolve(undefined);
              } else {
                this.uploader.uploadImage(result.url as string, 'Products');
                resolve(result.url);
              }
            })
            .end(resizedImage);
        });
      }
    );

    const imageUrls: (string | undefined)[] = await Promise.all(imagePromises);
    return imageUrls.filter((url) => url !== undefined) as string[];
  }
}

export { CloudinaryUploader, ImageProcessor };
