const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
const Account = require('../models/Account');

const { Configuration, PlaidApi, Products, CountryCode, PlaidEnvironments } = require('plaid');

// 🔍 Debug: Check that .env variables are being loaded correctly
console.log('🔍 PLAID_CLIENT_ID:', process.env.PLAID_CLIENT_ID);
console.log('🔍 PLAID_SECRET:', process.env.PLAID_SECRET);
console.log('🔍 PLAID_ENV:', process.env.PLAID_ENV);

// Env
const env = (process.env.PLAID_ENV || 'sandbox').toLowerCase();
const basePath = env === 'sandbox' ? PlaidEnvironments.Sandbox : PlaidEnvironments.Development;
console.log('🔗 Using Plaid Environment BasePath:', basePath);

const configuration = new Configuration({
  basePath,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});
const client = new PlaidApi(configuration);

// Create Link Token
router.post('/create_link_token', auth, async (req, res) => {
  try {
    const response = await client.linkTokenCreate({
      user: { client_user_id: String(req.user.id) },
      client_name: 'PFM Dashboard',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us], // Sandbox = US
      language: 'en',
    });
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('Plaid linkTokenCreate error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Error creating link token',
      details: error.response?.data || error.message,
    });
  }
});

// Exchange public_token and save access_token
router.post('/set_access_token', auth, async (req, res) => {
  const { public_token } = req.body;
  if (!public_token) return res.status(400).json({ message: 'public_token is required' });

  try {
    const exchange = await client.itemPublicTokenExchange({ public_token });
    const access_token = exchange.data.access_token;
    const item_id = exchange.data.item_id;

    await Account.findOneAndUpdate(
      { item_id },
      { userId: req.user.id, item_id, access_token },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, item_id });
  } catch (error) {
    console.error('itemPublicTokenExchange error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to exchange public token',
      details: error.response?.data || error.message,
    });
  }
});

// Fetch last 30 days transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user.id }).lean();
    if (!account) return res.status(404).json({ message: 'No linked account found' });

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    const fmt = (d) => d.toISOString().slice(0, 10);

    const result = await client.transactionsGet({
      access_token: account.access_token,
      start_date: fmt(start),
      end_date: fmt(end),
      options: { count: 100, offset: 0 },
    });

    res.json({
      total: result.data.total_transactions,
      transactions: result.data.transactions,
      accounts: result.data.accounts,
      item: result.data.item,
    });
  } catch (error) {
    console.error('transactionsGet error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Error fetching transactions',
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;


