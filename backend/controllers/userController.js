const User = require('../models/user');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt')


const sendNewPassword = async (req, res) => {
    try {
        
        const { email } = req.body;

        const user = await User.findOne({ email: email })
        
        if (!user) {
            return res.status(404).json({ error: "utilisateur n'existe pas" });
        }

        const newPwd = generatePassword(6, true, true, true);

        user.password = await hashPassword(newPwd)
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
        from: process.env.EMAIL,
        to: email,
        subject: 'Dentixio - réinstaller votre mot de passe ',
        html: `votre nouvelle mot de passe est : <b style="color: #4b67e4"> ${newPwd} </b>`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.error("Email sending failed:", error);
                return res.status(500).json({ error: "Email sending failed" });
            } else {
                console.log('Email sent: ' + info.response);
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