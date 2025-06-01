const router = require('express').Router();

const { createTransaction } = require('../controller/transactionController');

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
 * /transaction/{id}:
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

module.exports = router;