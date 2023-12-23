const express = require ('express')
const {
    createCampaign
} = require('../controllers/campaignController')
const router = express.Router()



// send sms
router.post('/createCampaign', createCampaign)


module.exports = router