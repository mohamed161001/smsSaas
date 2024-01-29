const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    amount: {
        type : String,
        required: true,
        default: ""
    },
    date: {
        type: String,
        required: true,
        default: ""
    },
    subscriptionType: {
        type: String,
        required: true,
        default: "",
        enum: ["mensuel", "annuel"]
    },

} , {timestamps: true})



module.exports = mongoose.model('Payment', paymentSchema);