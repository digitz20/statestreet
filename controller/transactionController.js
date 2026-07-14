const transactionModel = require('../model/transaction');
const userModel = require('../model/user');
const dashboardModel = require('../model/dashboard')
const sendEmail = require('../middlewares/nodemailer');
const cloudinary = require('../config/cloudinary');
const { depositConfirmationTemplate, withdrawalConfirmationTemplate } = require('../utils/mailTemplates');

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

        // Basic validation
        if (!depositAmount || !depositWallet) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Find user
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Upload payment proof to Cloudinary - now works with fixed .env variables
        const paymentProofs = [];
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'receipts',
                resource_type: 'image'
            });
            paymentProofs.push({
                imageUrl: result.secure_url,
                publicId: result.public_id
            });
        }

        // Create deposit transaction
        const depositTransaction = new transactionModel({
            user: user._id,
            type: 'deposit',
            amount: Number(depositAmount),
            wallet: depositWallet,
            status: 'pending',
            date: Date.now(),
            paymentProofs
        });
        await depositTransaction.save();

        // Update or create dashboard
        let dashboard = await dashboardModel.findOne({ user: user._id });
        if (!dashboard) {
            dashboard = new dashboardModel({
                username: user.fullName,
                balance: user.balance || 0,
                totalDeposit: user.totalDeposit || 0,
                image: user.image,
                user: user._id,
                transaction: []
            });
        }
        dashboard.transaction.push(depositTransaction._id);
        dashboard.totalDeposit = (dashboard.totalDeposit || 0) + Number(depositAmount);
        dashboard.balance = (dashboard.balance || 0) + Number(depositAmount);
        await dashboard.save();

        // Update user's totals too
        user.totalDeposit = (user.totalDeposit || 0) + Number(depositAmount);
        user.balance = (user.balance || 0) + Number(depositAmount);
        user.transaction.push(depositTransaction._id);
        await user.save();

        // Send confirmation email
        if (user.email) {
            const firstName = user.fullName ? user.fullName.split(' ')[0] : 'Valued Customer';
            const mailDetails = {
                subject: 'Deposit Confirmation - StateStreet',
                email: user.email,
                html: depositConfirmationTemplate(firstName, depositAmount, depositWallet)
            };
            sendEmail(mailDetails).catch(err => console.log('Email send error:', err));
        }

        res.status(201).json({ 
            message: 'Deposit initiated successfully!', 
            success: true,
            transaction: depositTransaction
        });

    } catch (error) {
        console.error('Create deposit error:', error);
        res.status(500).json({ message: 'Error initiating deposit', error: error.message });
    }
}

exports.withdraw = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'No request body received' });
        }
        const { id } = req.params;
        // Added withdrawCrypto to destructuring
        const { withdrawWallet, withdrawAmount, withdrawAddress, withdrawCrypto } = req.body; 
        
        // Validate required fields
        if (!withdrawWallet || !withdrawAmount || !withdrawAddress || !withdrawCrypto) { // Added withdrawCrypto check
            return res.status(400).json({ message: 'Withdraw amount, wallet, address, and cryptocurrency are required' });
        }

        // Validate supported cryptocurrencies (wallet address formats) - matches ALL frontend wallets
        const validWallets = {
            // Original supported coins
            bitcoin: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-HJ-NP-Z0-9]{39,59}$/, // BTC 
            ethereum: /^0x[a-fA-F0-9]{40}$/, // ETH/ERC20/BNB 
            litecoin: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$|^ltc1[a-HJ-NP-Z0-9]{39,59}$/, // LTC 
            dogecoin: /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/, // DOGE 
            tron: /^T[a-zA-Z0-9]{33}$/, // TRX 
            solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/, // SOL 
            bnb: /^0x[a-fA-F0-9]{40}$/, // BNB (same as ETH) 
            erc20: /^0x[a-fA-F0-9]{40}$/, // All ERC20 tokens 
            
            // Additional wallets from frontend dropdown 
            ripple: /^r[rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1uA-Z]{25,35}$/, // XRP 
            stellar: /^G[A-Z2-7]{55}$/, // XLM 
            monero: /^[48][a-zA-Z0-9]{94}$|^[AB][a-zA-Z0-9]{96}$/, // XMR 
            eos: /^[a-z1-5]{12}$/, // EOS 
            cardano: /^addr1[a-z0-9]{58}$|^Ae2tdPwUPEZ[a-zA-Z0-9]{48}$/, // ADA 
            tezos: /^tz[1-3][a-zA-Z0-9]{33}$/, // XTZ 
            matic: /^0x[a-fA-F0-9]{40}$/, // MATIC (same as ETH) 
            avax: /^X-avax1[a-z0-9]{39}$|^0x[a-fA-F0-9]{40}$/, // AVAX (C-chain same as ETH) 
            
            // Add capitalized versions to match common frontend dropdown values 
            Bitcoin: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-HJ-NP-Z0-9]{39,59}$/, 
            Ethereum: /^0x[a-fA-F0-9]{40}$/, 
            Litecoin: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$|^ltc1[a-HJ-NP-Z0-9]{39,59}$/, 
            Dogecoin: /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/, 
            Tron: /^T[a-zA-Z0-9]{33}$/, 
            Solana: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 
            BNB: /^0x[a-fA-F0-9]{40}$/, 
            ERC20: /^0x[a-fA-F0-9]{40}$/, 
            Ripple: /^r[rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1uA-Z]{25,35}$/, 
            Stellar: /^G[A-Z2-7]{55}$/, 
            Monero: /^[48][a-zA-Z0-9]{94}$|^[AB][a-zA-Z0-9]{96}$/, 
            Eos: /^[a-z1-5]{12}$/, 
            Cardano: /^addr1[a-z0-9]{58}$|^Ae2tdPwUPEZ[a-zA-Z0-9]{48}$/, 
            Tezos: /^tz[1-3][a-zA-Z0-9]{33}$/, 
            Matic: /^0x[a-fA-F0-9]{40}$/, 
            Avax: /^X-avax1[a-z0-9]{39}$|^0x[a-fA-F0-9]{40}$/ 
        }; 

        // Normalize the wallet name to handle any case inconsistencies 
        const normalizedWallet = withdrawWallet.trim().toLowerCase(); 
        let addressRegex; 
        
        // Find the correct regex regardless of case 
        if (validWallets[withdrawWallet]) { 
            addressRegex = validWallets[withdrawWallet]; 
        } else if (validWallets[normalizedWallet]) { 
            addressRegex = validWallets[normalizedWallet]; 
        } else { 
            console.log('Received wallet:', withdrawWallet); 
            console.log('Available wallets:', Object.keys(validWallets)); 
            return res.status(400).json({ message: `Unsupported cryptocurrency wallet: ${withdrawWallet}` }); 
        } 

        // Trim the address to remove any accidental spaces 
        const cleanedAddress = withdrawAddress.trim(); 
        // Validate the wallet address format matches the selected cryptocurrency 
        if (!addressRegex.test(cleanedAddress)) { 
            console.log(`Validation failed for ${withdrawWallet}: ${cleanedAddress}`); 
            return res.status(400).json({ message: `Invalid ${withdrawWallet} wallet address format. Please check your address.` }); 
        } 

        // Find user 
        const user = await userModel.findById(id); 
        if (!user) { 
            return res.status(404).json({ message: 'User not found' }); 
        } 

        // Get or create dashboard 
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

        // Validate withdrawal amount and check sufficient balance (Corrected Logic)
        const currentBalance = dashboard.balance || 0; 
        const amountToWithdraw = Number(withdrawAmount); 

        if (amountToWithdraw <= 0) { 
            return res.status(400).json({ message: 'Withdrawal amount must be positive.' }); 
        } 

        const newBalance = currentBalance - amountToWithdraw; 

        if (newBalance < 0) { 
            return res.status(400).json({ message: 'Insufficient balance to process this withdrawal. Withdrawal would result in a negative balance.' }); 
        } 

        // Create withdrawal transaction 
        const withdrawTransaction = new transactionModel({ 
            user: user._id, 
            type: 'withdrawal', 
            amount: amountToWithdraw, 
            wallet: withdrawWallet, 
            address: cleanedAddress, // Use cleanedAddress
            crypto: withdrawCrypto, // Added crypto field
            status: 'pending', 
            date: Date.now() 
        }); 
        await withdrawTransaction.save(); 

        // Update dashboard 
        dashboard.transaction.push(withdrawTransaction._id); 
        dashboard.balance = newBalance; 
        await dashboard.save(); 

        // Update user's balance too 
        user.balance = newBalance; 
        user.transaction.push(withdrawTransaction._id); 
        await user.save(); 

        // Send withdrawal confirmation email 
        if (user.email) { 
            const firstName = user.fullName ? user.fullName.split(' ')[0] : 'Valued Customer'; 
            const mailDetails = { 
                from: process.env.EMAIL_USER, // Added from field
                to: user.email, // Changed email to to
                subject: 'Withdrawal In Progress - StateStreet', 
                html: withdrawalConfirmationTemplate(firstName, amountToWithdraw, withdrawWallet, cleanedAddress, withdrawCrypto) // Passed withdrawCrypto
            }; 
            sendEmail(mailDetails).catch(err => console.log('Withdrawal email send error:', err)); 
        } else {
            console.log('User email not found, skipping withdrawal email.');
        }

        // Return success with the specific message you requested 
        res.status(201).json({ 
            message: 'Withdrawal in progress... please note withdrawal might take sometime to reflect on your account.', 
            success: true, 
            withdraw: withdrawTransaction, 
            dashboard 
        }); 

    } catch (error) { 
        console.error('Withdraw error:', error); 
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