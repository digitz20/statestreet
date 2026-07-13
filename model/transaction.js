// model/transaction.js

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'trade'],
        required: true,
    },
    tradeType: {
        type: String,
        enum: ['buy', 'sell'],
        required: function() {
            return this.type === 'trade';
        }
    },
    symbol: {
        type: String,
        required: function() {
            return this.type === 'trade';
        }
    },
    duration: {
        type: Number,
        required: function() {
            return this.type === 'trade';
        }
    },
    amount: {
        type: Number,
        required: true,
    },
    wallet: {
        type: String,
        enum: [
            'bitcoin', 'ethereum', 'litecoin', 'dogecoin', 'ripple', 'stellar',
            'monero', 'tron', 'eos', 'cardano', 'solana', 'tezos', 'matic', 'avax'
        ],
        required: true,
    },
    address: {
        type: String, // For withdrawAddress or depositWallet address
        required: function() {
            return this.type === 'withdrawal';
        }
    },
    paymentProofs: [{
        imageUrl: {
            type: String,
        },
        publicId: {
            type: String,
        }
    }],
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    date: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

const transactionModel = mongoose.model('Transactions', transactionSchema);

module.exports = transactionModel;