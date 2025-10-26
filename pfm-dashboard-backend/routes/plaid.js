import express from 'express';
import authMiddleware from '../middleware/auth';
import Account from '../models/Account';
import { Configuration, PlaidApi, Products, CountryCode, PlaidEnvironments } from 'plaid';

const router = express.Router();

const PLAID_ENV = (process.env.PLAID_ENV || 'sandbox').trim().toLowerCase();
const PLAID_CLIENT_ID = (process.env.PLAID_CLIENT_ID || '').trim();
const PLAID_SECRET = (process.env.PLAID_SECRET || '').trim();

const basePath =
  PLAID_ENV === 'sandbox'
    ? PlaidEnvironments.sandbox
    : PLAID_ENV === 'development'
    ? PlaidEnvironments.development
    : PlaidEnvironments.production;

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

router.post('/create_link_token', authMiddleware, async (req, res) => {
  try {
    if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
      return res.status(500).json({ message: 'Plaid keys not configured. Please set PLAID_CLIENT_ID and PLAID_SECRET.' });
    }

    const response = await client.linkTokenCreate({
      user: { client_user_id: String(req.user!.id) },
      client_name: 'PFM Dashboard',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en'
    });

    res.json({ link_token: response.data.link_token });
  } catch (error: any) {
    console.error('Plaid linkTokenCreate error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Error creating link token',
      details: error.response?.data || error.message
    });
  }
});

router.post('/set_access_token', authMiddleware, async (req, res) => {
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
      { userId: req.user!.id, item_id, access_token },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, item_id });
  } catch (error: any) {
    console.error('itemPublicTokenExchange error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to exchange public token',
      details: error.response?.data || error.message
    });
  }
});

router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user!.id }).lean();
    if (!account) {
      return res.status(404).json({ message: 'No linked account found' });
    }

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);

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
  } catch (error: any) {
    console.error('transactionsGet error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Error fetching transactions',
      details: error.response?.data || error.message
    });
  }
});

router.get('/accounts', authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user!.id }).lean();
    if (!account) {
      return res.status(404).json({ message: 'No linked account found' });
    }

    const balances = await client.accountsBalanceGet({ access_token: account.access_token });
    res.json({ accounts: balances.data.accounts });
  } catch (error: any) {
    console.error('accountsBalanceGet error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Error fetching accounts',
      details: error.response?.data || error.message
    });
  }
});

export default router;
