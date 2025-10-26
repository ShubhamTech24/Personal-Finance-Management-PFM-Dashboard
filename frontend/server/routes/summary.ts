import express from 'express';
import authMiddleware from '../middleware/auth';
import Account from '../models/Account';
import categorize from '../utils/categorize';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

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

const client = new PlaidApi(new Configuration({
  basePath,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14'
    }
  }
}));

const ymd = (d: Date) => d.toISOString().slice(0, 10);

router.get('/spend-by-category', authMiddleware, async (req, res) => {
  try {
    const acc = await Account.findOne({ userId: req.user!.id }).lean();
    if (!acc) {
      return res.status(404).json({ message: 'No linked account' });
    }

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    const tx = await client.transactionsGet({
      access_token: acc.access_token,
      start_date: ymd(start),
      end_date: ymd(end),
      options: { count: 250, offset: 0 }
    });

    const map: Record<string, number> = {};
    for (const t of tx.data.transactions) {
      const cat = categorize(t as any);
      const amt = Number(t.amount) || 0;
      const signed = cat === 'Income' ? -amt : amt;
      map[cat] = (map[cat] || 0) + signed;
    }

    const rows = Object.entries(map).map(([name, value]) => ({ name, value }));
    res.json({ rows });
  } catch (e: any) {
    console.error('spend-by-category error:', e.response?.data || e.message);
    res.status(500).json({ message: 'Failed', details: e.response?.data || e.message });
  }
});

router.get('/monthly-summary', authMiddleware, async (req, res) => {
  try {
    const acc = await Account.findOne({ userId: req.user!.id }).lean();
    if (!acc) {
      return res.status(404).json({ message: 'No linked account' });
    }

    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 5);

    const tx = await client.transactionsGet({
      access_token: acc.access_token,
      start_date: ymd(start),
      end_date: ymd(end),
      options: { count: 500, offset: 0 }
    });

    const byMonth: Record<string, { month: string; expense: number; income: number }> = {};
    for (const t of tx.data.transactions) {
      const m = (t.date || '').slice(0, 7);
      const cat = categorize(t as any);
      const amt = Number(t.amount) || 0;
      if (!byMonth[m]) byMonth[m] = { month: m, expense: 0, income: 0 };
      if (cat === 'Income') byMonth[m].income += amt;
      else byMonth[m].expense += amt;
    }

    const rows = Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month));
    res.json({ rows });
  } catch (e: any) {
    console.error('monthly-summary error:', e.response?.data || e.message);
    res.status(500).json({ message: 'Failed', details: e.response?.data || e.message });
  }
});

export default router;
