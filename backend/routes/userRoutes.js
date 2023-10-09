const express = require ('express')
const {
    sendNewPassword
} = require('../controllers/userController')
const router = express.Router()

// send new password
router.post('/forgot_pwd',sendNewPassword)

module.exports = router