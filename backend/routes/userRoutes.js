const express = require('express');
const { authenticateToken } = require('../middleware/authenticationToken.js');
const { updateUser, deletedUser, getUserData } = require('../controllers/userController.js');
const router = express.Router()

router.post("/update/:id",authenticateToken,updateUser)
router.delete("/delete/:id",authenticateToken,deletedUser)
router.get("/getUserdata/:id",authenticateToken,getUserData)

module.exports = router