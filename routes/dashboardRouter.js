const router = require('express').Router()

const { getProfile } = require('../controller/dashboardController')

/**
 * @swagger
 * /api/v1/getProfile/{id}:
 *   get:
 *     summary: Get a user dashboard profile (view only)
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 dashboard:
 *                   $ref: '#/components/schemas/Dashboard'
 *       404:
 *         description: User or dashboard not found
 *       500:
 *         description: Error getting profile
 */

router.get('/getProfile/:id', getProfile);

module.exports = router
