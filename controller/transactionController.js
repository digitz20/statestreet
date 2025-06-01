const transactionModel = require('../model/transaction');
const userModel = require('../model/user');

/**
 * Creates a new transaction for a user.
 */
exports.createTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, type, paymenttype, status, date } = req.body; // use 'paymenttype' to match schema

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const transaction = new transactionModel({
            amount,
            type,
            paymenttype, // ensure this matches your schema
            status,
            date: date || Date.now(), // use provided date or default to now
            user: user._id
        });

        await transaction.save();
        res.status(201).json({ message: 'Transaction created successfully', transaction });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Error creating transaction', error: error.message });
    }
};