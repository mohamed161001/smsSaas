const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {

    try {
        const { authorization } = req.headers

        if (!authorization) {
            return res.status(401).json({error: "unauthorized"})
        }

        const token = authorization.split(" ")[1]

        const { _id } = jwt.verify(token, process.env.SECRET)

        const user = await User.findById({ _id }).select({_id})

        if(!user || user.status === 'disabled') {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = auth