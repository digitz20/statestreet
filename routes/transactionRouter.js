const router = require('express').Router();
const multer = require('multer')

const { withdraw, createDeposit, createTrade, getTransactions } = require('../controller/transactionController');
const upload = require('../utils/multer')






/**
 * @swagger
 * components:
 *   schemas:
 *     Transactions:
 *       type: object
 *       properties:
 *         depositWallet:
 *           type: string
 *           enum: [bitcoin, ethereum, litecoin, dogecoin, ripple, stellar, monero, tron, eos, cardano, solana, tezos, matic, avax]
 *           description: Wallet type for deposit (cryptocurrency)
 *         withdrawWallet:
 *           type: string
 *           enum: [bitcoin, ethereum, litecoin, dogecoin, ripple, stellar, monero, tron, eos, cardano, solana, tezos, matic, avax]
 *           description: Wallet type for withdrawal (cryptocurrency)
 */



/**
 * @swagger
 * /api/v1/createDeposit/{id}:
 *   post:
 *     summary: Initiate a deposit for a user, with optional payment proof image upload
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               depositAmount:
 *                 type: number
 *                 description: Amount to deposit
 *               depositWallet:
 *                 type: string
 *                 enum: [bitcoin, ethereum, litecoin, dogecoin, ripple, stellar, monero, tron, eos, cardano, solana, tezos, matic, avax]
 *                 description: Wallet to deposit into (must be one of the supported cryptocurrencies)
 *               receipts:
 *                 type: string
 *                 format: binary
 *                 description: Image file as proof of payment (optional)
 *     responses:
 *       201:
 *         description: Deposit initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 newDeposit:
 *                   $ref: '#/components/schemas/Dashboard'
 *       400:
 *         description: Deposit amount and wallet are required
 *       404:
 *         description: User or dashboard not found
 *       500:
 *         description: Error initiating deposit
 */

// Both frontend and backend use 'receipts' as the field name
router.post('/createDeposit/:id', upload.single('receipts'), createDeposit);

/**
 * @swagger
 * /api/v1/withdraw/{id}:
 *   post:
 *     summary: Initiate a withdrawal for a user
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               withdrawWallet:
 *                 type: string
 *                 enum: [bitcoin, ethereum, litecoin, dogecoin, ripple, stellar, monero, tron, eos, cardano, solana, tezos, matic, avax]
 *                 description: Wallet to withdraw from (must be one of the supported cryptocurrencies)
 *               withdrawAmount:
 *                 type: number
 *                 description: Amount to withdraw
 *               withdrawAddress:
 *                 type: string
 *                 description: Address to send withdrawal to
 *     responses:
 *       201:
 *         description: Withdraw initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 newWithdraw:
 *                   $ref: '#/components/schemas/Dashboard'
 *       400:
 *         description: Withdraw amount and address are required
 *       404:
 *         description: User or dashboard not found
 *       500:
 *         description: Error initiating withdraw
 */
router.post('/withdraw/:id', upload.none(), withdraw);


/**
 * @swagger
 * /api/v1/createTrade/{id}:
 *   post:
 *     summary: Create a buy/sell trade for a user
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [buy, sell]
 *                 example: buy
 *               symbol:
 *                 type: string
 *                 example: BTC/USD
 *               amount:
 *                 type: number
 *                 example: 1000
 *               duration:
 *                 type: number
 *                 example: 7
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 example: '2024-06-01T12:00:00Z'
 *     responses:
 *       201:
 *         description: Trade created successfully
 *       400:
 *         description: Invalid trade data or insufficient balance
 *       404:
 *         description: User not found
 *       500:
 *         description: Error processing trade
 */
router.post('/createTrade/:id', createTrade);

/**
 * @swagger
 * /api/v1/getTransactions/{id}:
 *   get:
 *     summary: Get all transactions for a user
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Transaction' # Assuming a Transaction schema exists
 *       404:
 *         description: User not found
 *       500:
 *         description: Error retrieving transactions
 */
router.get('/getTransactions/:id', getTransactions);

module.exports = router;