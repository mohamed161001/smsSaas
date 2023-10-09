const User = require('../models/user');
const validator = require('validator');
const bcrypt = require('bcrypt');
const fs = require('fs');
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
        if (req.body.smsToken) user.smsToken = req.body.smsToken
        if (req.body.smsNumberDev) user.smsNumberDev = req.body.smsNumberDev
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
        console.log(error);
        return res.status(500).json({
            error: error,
            errorMessage: 'something went wrong in get user'
        })
    }
};

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
}