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
    // lastName: {
    //     type: String,
    //     required: true,
    //     default: ""
    // },
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
    // group: {
    //     type : mongoose.Types.ObjectId,
    //     ref: 'Group',
    //     default: null
    // },
    // additionalPhoneNumber: {
    //     type: String,
    //     required: false,
    //     default: ""
    // },
    // city: {
    //     type: String,
    //     required: false,
    //     default: ""
    // },
    // address: {
    //     type: String,
    //     required: false,
    //     default: ""
    // },
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