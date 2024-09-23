const express = require('express')
const { userSignUp, userLogin, googleAuth, signOut } = require('../controllers/authController')
const router = express.Router()

router.post("/signup",userSignUp)
router.post("/signin",userLogin)
router.post("/google",googleAuth)
router.post("/signout",signOut)

module.exports = router