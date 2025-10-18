const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Account = require('../models/Account');
const { Configuration, PlaidApi, Products, CountryCode, PlaidEnvironments } = require('plaid');

// --- Read & sanitize envs ---
const PLAID_ENV = (process.env.PLAID_ENV || 'sandbox').trim().toLowerCase();
const PLAID_CLIENT_ID = (process.env.PLAID_CLIENT_ID || '').trim();
const PLAID_SECRET = (process.env.PLAID_SECRET || '').trim();

// --- Debug: Verify environment variables ---
console.log('🔍 PLAID_CLIENT_ID:', PLAID_CLIENT_ID);
console.log('🔍 PLAID_SECRET:', PLAID_SECRET);
console.log('🔍 PLAID_ENV:', PLAID_ENV);

// --- Plaid environment selection ---
const basePath =
  PLAID_ENV === 'sandbox'
    ? PlaidEnvironments.sandbox
    : PLAID_ENV === 'development'
    ? PlaidEnvironments.development
    : PlaidEnvironments.production;

console.log('🔗 Using Plaid Environment BasePath:', basePath ? basePath.basePath : 'undefined');



if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
  console.error('❌ PLAID_CLIENT_ID / PLAID_SECRET missing. Check .env and restart.');
}

// --- Plaid Client Configuration ---
const configuration = new Configuration({
  basePath,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14'
    }
  }
});

const client = new PlaidApi(configuration);

// --- Health route to verify environment on server ---
router.get('/health', (req, res) => {
  res.json({
    env: PLAID_ENV,
    clientId: mask(PLAID_CLIENT_ID),
    secret: mask(PLAID_SECRET)
  });
});

// --- Create Link Token ---
router.post('/create_link_token', auth, async (req, res) => {
  try {
    if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
      return res.status(500).json({ message: 'Plaid keys not loaded. Fix .env and restart server.' });
    }

    const response = await client.linkTokenCreate({
      user: { client_user_id: String(req.user.id) },
      client_name: 'PFM Dashboard',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en'
    });

    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('Plaid linkTokenCreate error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Error creating link token',
      details: error.response?.data || error.message
    });
  }
});

// --- Exchange public_token and store access_token ---
router.post('/set_access_token', auth, async (req, res) => {
  const { public_token } = req.body;
  if (!public_token) {
    return res.status(400).json({ message: 'public_token is required' });
  }

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
      details: error.response?.data || error.message
    });
  }
});

// --- Fetch last 30 days transactions ---
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
      options: { count: 100, offset: 0 }
    });

    res.json({
      total: result.data.total_transactions,
      transactions: result.data.transactions,
      accounts: result.data.accounts,
      item: result.data.item
    });
  } catch (error) {
    console.error('transactionsGet error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Error fetching transactions',
      details: error.response?.data || error.message
    });
  }
});

// --- Fetch Accounts and Balances ---
router.get('/accounts', auth, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user.id }).lean();
    if (!account) return res.status(404).json({ message: 'No linked account found' });

    const balances = await client.accountsBalanceGet({ access_token: account.access_token });
    res.json({ accounts: balances.data.accounts });
  } catch (error) {
    console.error('accountsBalanceGet error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Error fetching accounts',
      details: error.response?.data || error.message
    });
  }
});

module.exports = router;