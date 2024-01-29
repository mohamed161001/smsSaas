const mongoose = require('mongoose');
const Contact = require('./contactModel');
const Group = require('./groupModel');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    title: {
        type: String
    },
    path: {
        type: String
    }
})

const contactSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        default: ""
    },
    phoneNumber: {
        type: String,
        required: true,
        default: ""
    },
    // an array of groups
    group: {
        type: [mongoose.Types.ObjectId],
        ref: 'Group',
        default: []
    },
    images: {
        type: [imageSchema],
        default: []
    },
    client: {
        type : String,
        required: true,
        default: ""
    },

} , {timestamps: true})

module.exports = mongoose.model('Contact', contactSchema);