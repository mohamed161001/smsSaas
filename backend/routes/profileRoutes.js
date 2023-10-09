const express = require('express');
const profileRouter = express.Router();
const uploadImage = require('../middlewares/uploadImage');
const {
  getUser,
  updateProfile,
  deleteUserImage
} = require('../controllers/profileController');

profileRouter.get('/:id', getUser);
profileRouter.patch('/:id', uploadImage, updateProfile);
profileRouter.delete('/:id', deleteUserImage);

module.exports = profileRouter;