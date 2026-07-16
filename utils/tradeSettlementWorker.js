// tradeSettlementWorker.js - Background worker to automatically settle active trades
const axios = require('axios');
const transactionModel = require('../model/transaction');
const dashboardModel = require('../model/dashboard');
const userModel = require('../model/user');

// Fetch real-time prices from CoinGecko
const fetchCurrentPrices = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,litecoin,ripple,dogecoin&vs_currencies=usd');
    return response.data;
  } catch (err) {
    console.error('Failed to fetch market prices:', err);
    return null;
  }
};

// Map symbols to CoinGecko IDs
const symbolToCoinId = {
  'BTC/USD': 'bitcoin',
  'ETH/USD': 'ethereum',
  'SOL/USD': 'solana',
  'LTC/USD': 'litecoin',
  'XRP/USD': 'ripple',
  'DOGE/USD': 'dogecoin'
};

// Process all active trades that have reached their end time
const processSettlements = async () => {
  try {
    console.log('Running trade settlement check...');
    
    // Get all active trade transactions
    const activeTrades = await transactionModel.find({ 
      type: 'trade', 
      status: 'active' 
    });

    if (activeTrades.length === 0) {
      console.log('No active trades to settle');
      return;
    }

    const prices = await fetchCurrentPrices();
    if (!prices) {
      console.log('Could not fetch prices, skipping settlement');
      return;
    }

    for (const trade of activeTrades) {
      // Calculate trade end time (trade.date + duration in minutes)
      const tradeEndTime = new Date(trade.date);
      tradeEndTime.setMinutes(tradeEndTime.getMinutes() + trade.duration);
      
      // If current time is past trade end time, settle the trade
      if (new Date() >= tradeEndTime) {
        console.log(`Settling trade ${trade._id} for ${trade.symbol}`);
        
        const coinId = symbolToCoinId[trade.symbol];
        if (!coinId || !prices[coinId]) {
          console.log(`No price data for ${trade.symbol}, marking as completed`);
          trade.status = 'completed';
          await trade.save();
          continue;
        }

        // Get entry price (price at trade time - approximation for demo)
        // In production you'd store entry price when creating the trade
        const currentPrice = prices[coinId].usd;
        const entryPrice = currentPrice * (0.98 + Math.random() * 0.04); // Simulate realistic entry price
        const priceChange = ((currentPrice - entryPrice) / entryPrice) * 100;
        
        // Calculate profit/loss
        let profitLoss;
        if (trade.tradeType === 'buy') {
          // Buy profit: if price goes up, you profit
          profitLoss = trade.amount * (priceChange / 100);
        } else {
          // Sell profit: if price goes down, you profit
          profitLoss = trade.amount * (-priceChange / 100);
        }

        // Update dashboard with profit/loss
        const dashboard = await dashboardModel.findOne({ user: trade.user });
        if (dashboard) {
          dashboard.balance += trade.amount + profitLoss;
          await dashboard.save();
          
          // Update user balance too
          const user = await userModel.findById(trade.user);
          if (user) {
            user.balance = dashboard.balance;
            await user.save();
          }
        }

        // Mark trade as completed with calculated profit
        trade.status = 'completed';
        trade.profit = profitLoss;
        await trade.save();
        
        console.log(`Trade ${trade._id} settled. Profit: $${profitLoss.toFixed(2)}`);
      }
    }
  } catch (err) {
    console.error('Error in settlement process:', err);
  }
};

// Run settlement check every 60 seconds
setInterval(processSettlements, 60000);

// Run once on startup
processSettlements();

module.exports = { processSettlements };