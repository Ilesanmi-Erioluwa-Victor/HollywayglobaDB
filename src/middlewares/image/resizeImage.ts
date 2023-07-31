import multer from 'multer';
import sharp from 'sharp';
import path from 'path'

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {

  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb({
      message: 'Unsupported file type or format',
    });
  }
};

const profileImage = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 2000000,
  },
});

const profilePhotoResize = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));
  next();
};
