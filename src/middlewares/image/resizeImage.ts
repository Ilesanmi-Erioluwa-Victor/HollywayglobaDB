import multer from 'multer';
import sharp from 'sharp';
import path from 'path'

const multerStorage = multer.memoryStorage();

const MulterFilter = (req, file, cb) => {
  // check file type
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb({
      message: 'Unsupported file type or format',
    });
  }
};
