const express = require ('express')
const {
    getPayments,
    deletePayment,
    createPayment,
    updatePayment,
    getPayment,
} = require('../controllers/paymentController')
const router = express.Router()

// get all payments
router.get('/',getPayments)
// get one payment
router.get('/:id',getPayment)
// create a payment
router.post('/',createPayment)
// update a payment
router.patch('/:id',updatePayment)
// delete a payment
router.delete('/:id',deletePayment)

module.exports = router