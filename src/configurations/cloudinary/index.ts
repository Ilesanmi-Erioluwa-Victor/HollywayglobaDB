import { v2 as cloudinary } from 'cloudinary'
import { ENV } from '../config'

cloudinary.config({
    cloud_name: ENV.CLOUDIANRY.NAME,
    api_key: ENV.CLOUDIANRY.KEY,
    api_secret: ENV.CLOUDIANRY.SECRET
})
