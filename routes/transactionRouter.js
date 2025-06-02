const router = require('express').Router();
const multer = require('multer')

const { createTransaction, withdraw, createDeposit } = require('../controller/transactionController');
const upload = require('../utils/multer')



/**
 * @swagger
 * components:
 *   schemas:
 *     TransactionInput:
 *       type: object
 *       properties:
 *         amount:
 *           type: number
 *           example: 100.50
 *         type:
 *           type: string
 *           enum: [deposit, withdrawal, assigned]
 *           example: deposit
 *         paymenttype:
 *           type: string
 *           enum: [cash, card, bank, other]
 *           example: card
 *         date:
 *           type: string
 *           format: date-time
 *           example: '2024-06-01T12:00:00Z'
 *       required:
 *         - amount
 *         - type
 *         - paymenttype
 *     Transaction:
 *       allOf:
 *         - $ref: '#/components/schemas/TransactionInput'
 *         - type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [pending, completed, failed]
 *               description: Transaction status (always 'pending' on creation)
 *               example: pending
 *             user:
 *               type: string
 *               description: User ID
 *               example: 60d0fe4f5311236168a109cb
 *             _id:
 *               type: string
 *               description: Transaction ID
 *               example: 60d0fe4f5311236168a109ca
 */

/**
 * @swagger
 * /api/v1/transaction/{id}:
 *   post:
 *     summary: Create a new transaction for a user
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
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction created successfully
 *                 transaction:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Error creating transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating transaction
 *                 error:
 *                   type: string
 *                   example: Detailed error message
 */

router.post('/transaction/:id', createTransaction);


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
 *               paymentProof:
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

router.post('/createDeposit/:id', upload.single('paymentProof'), createDeposit);

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
 *         multipart/form-data:
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

module.exports = router;