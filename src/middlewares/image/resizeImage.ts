import { Response, Request, NextFunction } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path'

const multerStorage = multer.memoryStorage();

const multerFilter = (req: any, file : any, cb : any) => {

  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb({
      message: 'Unsupported file type or format',
    });
  }
};

export const profileImage = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 2000000,
  },
});

export const profileImageResize = async (req : Request, res : Response, next : NextFunction) => {
  if (!req.file) return next();
  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
  next();
};
