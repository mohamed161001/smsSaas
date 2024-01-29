const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campaignSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: ""
    },
    message: {
        type: String,
        required: true,
        default: ""
    },
    status: {
        type: String,
        required: false,
        default: "En attente",
        enum: ["En attente", "En cours", "Terminé","Programmé","Echoué"]
    },
    scheduledTime: {
        type: Date,
        required: false,
        default: ""
    },
    creditsUsed: {
        type: Number,
        required: false,
        default: 0
    },
    totalDelivered: {
        type: Number,
        required: false,
        default: 0
    },
    totalFailed: {
        type: Number,
        required: false,
        default: 0
    },
    client: {
        type : String,
        required: true,
        default: ""
    },
} , {timestamps: true})



module.exports = mongoose.model('Campaign', campaignSchema);