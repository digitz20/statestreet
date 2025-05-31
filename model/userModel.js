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

    }

},{timestamps: true})

const userModel = mongoose.model('users',userSchema)


module.exports = userModel;