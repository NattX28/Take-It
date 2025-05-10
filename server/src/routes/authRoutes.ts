import express from "express"
import * as authControllers from "../controllers/authControllers"
const router = express.Router()

router.post("/login", authControllers.login)
router.post("/signup", authControllers.signup)

export default router
