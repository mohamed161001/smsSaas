const express = require('express');
const profileRouter = express.Router();
const uploadImage = require('../middlewares/uploadImage');
const {
  getUser,
  updateProfile,
  deleteUserImage,
  updatePaymentLinks
} = require('../controllers/profileController');

profileRouter.get('/:id', getUser);
profileRouter.patch('/:id', uploadImage, updateProfile);
profileRouter.delete('/:id', deleteUserImage);
profileRouter.patch('/update-payment-link/:id', updatePaymentLinks);

module.exports = profileRouter;