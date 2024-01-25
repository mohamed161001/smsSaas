const User = require('../models/user');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')


const sendNewPassword = async (req, res) => {
    try {
        
        const { email } = req.body;

        const user = await User.findOne({ email: email })
        
        if (!user) {
            return res.status(404).json({ error: "utilisateur n'existe pas" });
        }

        // generate token
        const token = jwt.sign(
            { _id: user._id },
            process.env.SECRET,
            { expiresIn: '30m' }
        );

        const link = `http://localhost:5173/reset-password/${user._id}/${token}`;

        await user.save();

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PWD
            }
        });
          
        var mailOptions = {
        from: 'Smsini <' + process.env.EMAIL + '>',
        to: email,
        subject: 'Smsini - réinstaller votre mot de passe ',
        html: `<div style="text-align: center; font-family: 'Arial', sans-serif;">

        <p style="font-size: 14px;font-weight: bold;">Bonjour ${user.firstName} ${user.lastName},</p>
        <p style="font-size: 14px;">Vous avez demandé à réinitialiser votre mot de passe Smsini.</p>
        
        <a href="${link}" style="display: inline-block; margin: 20px 0; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;">Réinitialiser votre mot de passe</a>
    
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 14px; margin-bottom: 10px;">Si vous n'avez pas demandé à réinitialiser votre mot de passe, vous pouvez ignorer cet email.</p>
            <p style="font-size: 14px;">Merci,</p>
            <p style="font-size: 14px;">L'équipe Smsini</p>
        </div>
    
    </div>
    `
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return res.status(500).json({ error: "Email sending failed" });
            } else {
                return res.status(200).json({ message: "Mail envoyé avec succès, veuillez vérifier votre boite mail" });
            }
        });
        // console.log("user : ", user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

function generatePassword(length, includeUppercase, includeNumbers) {
    // Define character sets
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
  
    // Create a character set based on options
    let charset = lowercaseChars;
    if (includeUppercase) charset += uppercaseChars;
    if (includeNumbers) charset += numberChars;
  
    // Generate the password
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
  
    return password;
}

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
}

module.exports = {
    sendNewPassword
}