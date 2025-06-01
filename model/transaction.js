
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'withdrawal','assigned'], // Adjust as needed
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  paymentType: {
    type: String,
    required: true,
    // enum: ['cash', 'card', 'bank', 'other'], // Adjust as needed
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'verified', 'declined'], // Adjust as needed
  },
});


const transactionModel = mongoose.model('transactions', transactionSchema);  


module.exports = transactionModel;
