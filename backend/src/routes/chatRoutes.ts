import express from "express"
import * as chatControllers from "../controllers/chatControllers"
import { requiredAuthMiddleware } from "../middlewares/requiredAuthMiddlewares"
const BASE_URL_CHAT: string = "/chats"
const router = express.Router()

router.get(
  `${BASE_URL_CHAT}`,
  requiredAuthMiddleware,
  chatControllers.getChatList
)
router.post(
  `${BASE_URL_CHAT}`,
  requiredAuthMiddleware,
  chatControllers.createChatRoom
)
router.get(
  `${BASE_URL_CHAT}/:chatRoomId/messages`,
  requiredAuthMiddleware,
  chatControllers.getChatMessages
)
router.post(
  `${BASE_URL_CHAT}/:chatRoomId/messages`,
  requiredAuthMiddleware,
  chatControllers.sendMessage
)

export default router
