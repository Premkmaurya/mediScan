const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const authController = require("../controllers/auth.controller")
const router = express.Router()

router.post("/register",authController.registerUser)

router.post("/login",authController.loginUser)

router.get("/me",authMiddleware,authController.getMe)

module.exports = router;