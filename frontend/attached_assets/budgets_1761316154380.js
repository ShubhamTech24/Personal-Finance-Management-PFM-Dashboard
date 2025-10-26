const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Budget = require('../models/Budget');

router.get('/', auth, async (req, res) => {
  const rows = await Budget.find({ userId: req.user.id }).lean();
  res.json({ rows });
});

router.post('/', auth, async (req, res) => {
  const { category, monthlyLimit } = req.body;
  if (!category || monthlyLimit == null) return res.status(400).json({ message: 'category and monthlyLimit required' });

  const row = await Budget.findOneAndUpdate(
    { userId: req.user.id, category },
    { userId: req.user.id, category, monthlyLimit },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json(row);
});

router.delete('/:category', auth, async (req, res) => {
  await Budget.deleteOne({ userId: req.user.id, category: req.params.category });
  res.json({ ok: true });
});

module.exports = router;
