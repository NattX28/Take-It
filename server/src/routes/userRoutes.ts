import express from "express"
import * as userControllers from "../controllers/userControllers"
import { requiredAuthMiddleware } from "../middlewares/requiredAuthMiddlewares"
const router = express.Router()

router.post(
  "/friends/add",
  requiredAuthMiddleware,
  userControllers.sendFriendRequest
)
router.post(
  "/friends/accept",
  requiredAuthMiddleware,
  userControllers.acceptFriendRequest
)
router.post(
  "/friends/reject",
  requiredAuthMiddleware,
  userControllers.rejectFriendRequest
)
router.get("/friends", requiredAuthMiddleware, userControllers.getFriends)
router.get(
  "/friends/pending",
  requiredAuthMiddleware,
  userControllers.getPendingFriendRequests
)

export default router
