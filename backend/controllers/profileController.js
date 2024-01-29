const User = require('../models/user');
const validator = require('validator');
const bcrypt = require('bcrypt');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const getUser = async (req, res) => {
    try {
        const { id } = req.params;

        const exists = await User.exists({ _id: id})
        if (!exists) {
            return res.status(404).json({error: 'utilisateur inexistant'})
        }
        const user = await User.findById(id)
        return res.status(200).json({user})
    } catch (error) {
        return res.status(500).json({error})
    }
};

//::::::::::::::::::::: function to generate token for sms ::::::::::::::::::::::::::::::::::::::::::::::::::::::
const genToken = async (userToken) => {
    try {
        const response = await axios.post(
            'https://api.orange.com/oauth/v3/token',
            {
                grant_type: 'client_credentials'
            },
            {
                headers: {
                    Authorization: userToken,
                    Accept: 'application/json',
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }
        );
  
        return response.data.access_token;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error('Invalid credentials provided for token generation');
            throw new Error('Veuillez vérifier vos identifiants SMS');
        } 
        else {
            console.error('Error generating token:', error.message);
            throw new Error('Failed to generate token');
        }
    }
  };
  // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const exists = await User.exists({ _id: id})
        if (!exists) {
            return res.status(404).json({error: 'utilisateur inexistant'})
        }
        const user = await User.findById(id)
        if (req.body.email && !validator.isEmail(req.body.email)) {
            return res.status(400).json({error: 'veuillez entrer un email valide',})
        }
        if (req.body.password && !validator.isStrongPassword(req.body.password)) {
            return res.status(400).json({error: 'mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial'})
        }
        if(req.body.firstName) user.firstName = req.body.firstName
        if(req.body.lastName) user.lastName = req.body.lastName
        if(req.body.email) user.email = req.body.email
        if(req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber
        if (req.body.codeProf) user.codeProf = req.body.codeProf
        // if (req.body.smsToken) user.smsToken = req.body.smsToken
        // if (req.body.smsNumberDev) user.smsNumberDev = req.body.smsNumberDev
        if (req.body.smsToken && req.body.smsNumberDev) {
            try {
                const token = await genToken(req.body.smsToken);
                if (token) {
                    user.smsToken = req.body.smsToken;
                    user.smsNumberDev = req.body.smsNumberDev;
                }
            } catch (error) {
                return res.status(400).json({error: error.message})
            }
        }
        if(req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            user.password = hashedPassword
        } 
        // if (req.body.Image === '') user.image = req.body.Image;
        if (req.file) {
            user.image = req.file.path;
        }
        await user.save();
        return res.status(200).json({message: "profile mis à jour"})
    } catch (error) {
        return res.status(400).json({error})
    }
};


const updatePaymentLinks = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)

        if(!user){
            return res.status(404).json({error: 'Utilisateur inexistant'})
        }

        if(user.role !== 'admin'){
            return res.status(403).json({error: 'Vous n\'avez pas les droits pour effectuer cette action'})
        }

        if(req.body.monthlySubscriptionLink){
            user.monthlySubscriptionLink = req.body.monthlySubscriptionLink;
        }

        if(req.body.yearlySubscriptionLink){
            user.yearlySubscriptionLink = req.body.yearlySubscriptionLink;
        }

        await user.save();

        return res.status(200).json({message: "liens mis à jours"})

    } catch (error) {
        return res.status(400).json({error})
    
    }
}

const deleteUserImage = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({error: 'Utilisateur inexistant'});
        }

        if(user.image) {
            const imagePath = path.join(__dirname, '../'+user.image);

            fs.unlink(imagePath, (deleteErr) => {
                if (deleteErr) {
                    console.error(deleteErr);
                }
            });

            user.image = "";
            await user.save();
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: error })
    }
}

module.exports = {
    getUser,
    updateProfile,
    deleteUserImage,
    updatePaymentLinks
}