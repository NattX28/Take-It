import express from "express"
import * as galleryController from "../controllers/galleryControllers"
import upload from "../middlewares/uploadMiddleware"
import { requiredAuthMiddleware } from "../middlewares/requiredAuthMiddlewares"

const router = express.Router()

router.post(
  "/gallery/upload",
  upload.single("image"),
  requiredAuthMiddleware,
  galleryController.uploadPhoto
)
// get photos in gallery with infinit scroll
router.get(
  "/gallery/:id",
  requiredAuthMiddleware,
  galleryController.getPhotosGallery
)

export default router
