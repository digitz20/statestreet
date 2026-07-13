const transactionModel = require('../model/transaction');
const userModel = require('../model/user');
const dashboardModel = require('../model/dashboard')
const sendEmail = require('../middlewares/nodemailer');
const cloudinary = require('../config/cloudinary');

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


exports.createDeposit = async (req, res) => {
    try {
        const { id } = req.params;
        const { depositAmount, depositWallet } = req.body;
        if (!depositAmount || !depositWallet) {
            return res.status(400).json({ message: 'Deposit amount and wallet are required' });
        }
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let dashboard = await dashboardModel.findOne({ user: user._id });
        if (!dashboard) {
            dashboard = new dashboardModel({
                username: user.fullName,
                balance: user.balance || 0,
                totalDeposit: user.totalDeposit || 0,
                image: user.image,
                user: user._id,
                transaction: user.transaction || [],
            });
            await dashboard.save();
        }

        let paymentProofs = [];
        if (req.files && req.files.length > 0) {
            // Upload all receipt files to Cloudinary
            const uploadPromises = req.files.map(file => 
                cloudinary.uploader.upload(file.path, {
                    folder: 'deposit-receipts',
                    resource_type: 'image'
                })
            );
            
            const uploadResults = await Promise.all(uploadPromises);
            paymentProofs = uploadResults.map(result => ({
                publicId: result.public_id,
                imageUrl: result.secure_url
            }));
        }

        const depositTransaction = new transactionModel({
            user: user._id,
            type: 'deposit',
            amount: depositAmount,
            wallet: depositWallet,
            status: 'pending',
            date: Date.now(),
            paymentProofs: paymentProofs
        });
        await depositTransaction.save();

        dashboard.transaction.push(depositTransaction._id);
        dashboard.totalDeposit = (dashboard.totalDeposit || 0) + Number(depositAmount);
        dashboard.balance = (dashboard.balance || 0) + Number(depositAmount); // Update balance
        await dashboard.save();

        res.status(201).json({
            message: 'Deposit initiated successfully',
            deposit: depositTransaction,
            dashboard
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error initiating deposit', error: error.message });
    }
}

exports.withdraw = async (req, res) => {
    try {
          if (!req.body) {
        return res.status(400).json({ message: 'No request body received' });
        }
        const { id } = req.params;
        const { withdrawWallet, withdrawAmount, withdrawAddress } = req.body;
        if (!withdrawWallet || !withdrawAmount || !withdrawAddress) {
            return res.status(400).json({ message: 'Withdraw amount, wallet, and address are required' });
        }
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        let dashboard = await dashboardModel.findOne({ user: user._id });
        if (!dashboard) {
            dashboard = new dashboardModel({
                username: user.fullName,
                balance: user.balance || 0,
                totalDeposit: user.totalDeposit || 0,
                image: user.image,
                user: user._id,
                transaction: user.transaction || [],
            });
            await dashboard.save();
        }

        const withdrawTransaction = new transactionModel({
            user: user._id,
            type: 'withdrawal',
            amount: withdrawAmount,
            wallet: withdrawWallet,
            address: withdrawAddress,
            status: 'pending',
            date: Date.now()
        });
        await withdrawTransaction.save();

        dashboard.transaction.push(withdrawTransaction._id);
        dashboard.balance = (dashboard.balance || 0) - Number(withdrawAmount); // Update balance
        await dashboard.save();

        res.status(201).json({
            message: 'Withdraw initiated successfully',
            withdraw: withdrawTransaction,
            dashboard
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error initiating withdraw', error: error.message });
    }
};

exports.createTrade = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, symbol, amount, duration, timestamp } = req.body;
        
        if (!type || !symbol || !amount || !duration) {
            return res.status(400).json({ message: 'Trade type, symbol, amount, and duration are required' });
        }

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let dashboard = await dashboardModel.findOne({ user: user._id });
        if (!dashboard) {
            dashboard = new dashboardModel({
                username: user.fullName,
                balance: 0,
                totalDeposit: 0,
                user: user._id,
                transaction: []
            });
            await dashboard.save();
        }

        // Check if user has sufficient balance
        if (amount > dashboard.balance) {
            return res.status(400).json({ message: 'Insufficient balance to complete this trade' });
        }

        // Create trade transaction
        const tradeTransaction = new transactionModel({
            user: user._id,
            type: 'trade',
            tradeType: type, // 'buy' or 'sell'
            symbol: symbol,
            amount: amount,
            duration: duration,
            status: 'active',
            date: timestamp || Date.now()
        });
        await tradeTransaction.save();

        // Update dashboard - deduct the trade amount from balance
        dashboard.transaction.push(tradeTransaction._id);
        dashboard.balance = dashboard.balance - Number(amount);
        await dashboard.save();

        res.status(201).json({
            message: type.toUpperCase() + ' order submitted successfully',
            trade: tradeTransaction,
            dashboard
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing trade', error: error.message });
    }
};