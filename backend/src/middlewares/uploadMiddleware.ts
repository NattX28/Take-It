import multer from "multer"
import { uploadConfig } from "../configs/uploadConfig"

// Create and export the multer middleware
const upload = multer(uploadConfig)

export default upload
