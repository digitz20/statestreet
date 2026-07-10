const router = require('express').Router()
const multer = require('multer');

const { createProfile, updateProfile,deleteProfile,
    getProfile} = require('../controller/dashboardController')
const upload = require('../utils/multer')

/**
 * @swagger
 * /api/v1/createProfile/{id}:
 *   post:
 *     summary: Create a user dashboard profile with image upload
 *     tags:
 *       - Dashboard
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
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Profile image file
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dashboard'
 *       400:
 *         description: No image file uploaded
 *       404:
 *         description: User not found
 *       500:
 *         description: Error creating profile
 */
router.post('/createProfile/:id', upload.single('image'), createProfile);


/**
 * @swagger
 * /api/v1/updateProfile/{id}:
 *   put:
 *     summary: Update a user dashboard profile (fields and/or image)
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               balance:
 *                 type: number
 *               totalDeposit:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: New profile image file
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dashboard'
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating profile
 */


// For updating profile (with multer middleware for file upload)
router.put('/updateProfile/:id', upload.single('image'), updateProfile);


/**
 * @swagger
 * /api/v1/deleteProfile/{id}:
 *   delete:
 *     summary: Delete a user dashboard profile
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
 *         description: Profile deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error deleting profile
 */

// For deleting profile
router.delete('/deleteProfile/:id', deleteProfile);


/**
 * @swagger
 * /api/v1/getProfile/{id}:
 *   get:
 *     summary: Get a user dashboard profile
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