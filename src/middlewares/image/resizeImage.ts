import { Response, Request, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';

const multerStorage = multer.memoryStorage();

const multerFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    const error = new Error('Unsupported file type or format');
    cb(error);
  }
};

export const profileImage = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 2000000,
  },
});

// export const productImageResize = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (!req.files) return next();
//   req.files.filename = `user-${Date.now()}-${req.file.originalname}`;

//   await sharp(req.file.buffer)
//     .resize(250, 250)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(path.join(`src/uploads/${req.file.filename}`));
//   next();
// };

export const profileImageResize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(`src/uploads/${req.file.filename}`));
  next();
};
