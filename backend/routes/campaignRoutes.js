const express = require ('express')
const {
    createCampaign,
    getCampaigns,
    getBalance,
} = require('../controllers/campaignController')
const router = express.Router()



// send sms
router.post('/createCampaign', createCampaign)
// get all campaigns
router.get('/', getCampaigns)
// get sms balance
router.get('/balance', getBalance)


module.exports = router