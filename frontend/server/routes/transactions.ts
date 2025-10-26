import express from 'express';
import authMiddleware from '../middleware/auth';
import Transaction from '../models/Transaction';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const t = await Transaction.create({ ...req.body, userId: req.user!.id, raw: req.body });
    res.json(t);
  } catch (err: any) {
    console.error('Create transaction error:', err.message);
    res.status(500).json({ message: 'Error creating transaction' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const t = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!.id },
      req.body,
      { new: true }
    );
    res.json(t);
  } catch (err: any) {
    console.error('Update transaction error:', err.message);
    res.status(500).json({ message: 'Error updating transaction' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const rows = await Transaction.find({ userId: req.user!.id }).sort({ date: -1 }).lean();
    res.json({ rows });
  } catch (err: any) {
    console.error('Get transactions error:', err.message);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

export default router;
