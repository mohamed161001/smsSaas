const mongoose = require('mongoose');
const Contact = require('./contactModel');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: ""
    },
    client: {
        type : String,
        required: true,
        default: ""
    },

} , {timestamps: true})



module.exports = mongoose.model('Group', groupSchema);