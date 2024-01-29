const Payment = require('../models/PaymentModel');
const mongoose = require('mongoose');

//get all Payments
const getPayments = async (req,res) => {
  try {
    const {page = 0, pageSize = 10, sort = null, userID} = req.query

    const generateSort = () => {   
      const sortParsed = JSON.parse(sort)
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = 'asc' ? 1 : -1)
      }
      return sortFormatted;
    }
    const sortFormatted = Boolean(sort) ? generateSort() : { createdAt: -1, _id: -1 }

    const payments = await Payment.find({user: userID})
    .sort(sortFormatted)
    .skip(page * pageSize)
    .limit(pageSize * 1)

    const totalpayments = payments.length

    return res.status(200).json({payments, totalpayments})
  } catch (error){
    return res.status(400).json({ error: error.message });
  }
}

//get one Payment
const getPayment = async (req,res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Paiment inexistant' });
  }

  try {
    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({ error: 'Paiment inexistant' });
    }

    return res.status(200).json(payment);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }  
}

//create a Payment
const createPayment = async (req, res) => {
  try {

    const payment = await Payment.create(req.body);
    res.status(200).json({payment});

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//update a Payment
const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({error: 'Paiment inexistant'});

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ error: 'Paiment inexistant' });
    }

    if (req.body.amount) {
      payment.amount = req.body.amount;
    }

    if (req.body.date) {
      payment.date = req.body.date;
    }

    if (req.body.subscriptionType) {
      payment.subscriptionType = req.body.subscriptionType;
    }

    await payment.save();
    return res.status(200).json({payment});

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

//delete a Payment
const deletePayment = async (req, res) => {
  let { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Paiment inexistante' });
  }
  try {
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      return res.status(404).json({ error: 'Paiment inexistant' });
    }
    
    return res.status(200).json({payment});

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getPayments,
  deletePayment,
  createPayment,
  updatePayment,
  getPayment
}