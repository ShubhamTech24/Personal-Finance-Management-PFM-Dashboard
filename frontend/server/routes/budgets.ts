import express from 'express';
import authMiddleware from '../middleware/auth';
import Budget from '../models/Budget';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const rows = await Budget.find({ userId: req.user!.id }).lean();
    res.json({ rows });
  } catch (err: any) {
    console.error('Get budgets error:', err.message);
    res.status(500).json({ message: 'Error fetching budgets' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { category, monthlyLimit } = req.body;
    if (!category || monthlyLimit == null) {
      return res.status(400).json({ message: 'category and monthlyLimit required' });
    }

    const row = await Budget.findOneAndUpdate(
      { userId: req.user!.id, category },
      { userId: req.user!.id, category, monthlyLimit },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(row);
  } catch (err: any) {
    console.error('Create/update budget error:', err.message);
    res.status(500).json({ message: 'Error saving budget' });
  }
});

router.delete('/:category', authMiddleware, async (req, res) => {
  try {
    await Budget.deleteOne({ userId: req.user!.id, category: req.params.category });
    res.json({ ok: true });
  } catch (err: any) {
    console.error('Delete budget error:', err.message);
    res.status(500).json({ message: 'Error deleting budget' });
  }
});

export default router;
