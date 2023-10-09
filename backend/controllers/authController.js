const jwt = require('jsonwebtoken');
const User = require('../models/user');

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.login(email, password);
        const token = createToken(user._id)
        res.status(200).json({ user, token })
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const register = async (req, res) => {
    try {
        const {email, password, firstName, lastName, phoneNumber} = req.body;
        const user = await User.register(email, password, firstName, lastName, phoneNumber);
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '10d' })
}

module.exports = { login, register }