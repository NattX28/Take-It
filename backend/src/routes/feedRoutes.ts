import express from "express"
import * as feedControllers from "../controllers/feedControllers"
import { requiredAuthMiddleware } from "../middlewares/requiredAuthMiddlewares"

const router = express.Router()

router.get("/feed", requiredAuthMiddleware, feedControllers.getFeedPhotos)

export default router
