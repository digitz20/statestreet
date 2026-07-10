const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @swagger
 * /api/v1/prices:
 *   get:
 *     summary: Get cryptocurrency prices from CoinGecko
 *     tags: [Prices]
 *     responses:
 *       200:
 *         description: Successfully retrieved prices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: object
 *                 properties:
 *                   usd:
 *                     type: number
 *                   usd_24h_change:
 *                     type: number
 *       500:
 *         description: Server error
 */
router.get('/prices', async (req, res) => {
  console.log('CoinGecko prices endpoint hit.');
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple,dogecoin,cardano,polkadot,litecoin&vs_currencies=usd&include_24hr_change=true');
    console.log('Successfully fetched prices from CoinGecko:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching prices from CoinGecko:', error.message);
    if (error.response) {
      console.error('CoinGecko API response error:', error.response.status, error.response.data);
    }
    res.status(500).json({ message: 'Failed to fetch cryptocurrency prices' });
  }
});

module.exports = router;