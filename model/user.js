const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName : {
        type: String,
    },
    username : {
        type: String,
    },
    email : {
        type: String,
        required: true,
        lowercase: true
    },
    password : {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        enum: ['Individual', 'Business'],
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },

},{timestamps: true})

const userModel = mongoose.model('users',userSchema)


module.exports = userModel;