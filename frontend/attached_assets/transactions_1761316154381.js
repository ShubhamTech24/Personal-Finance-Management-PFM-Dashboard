const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

router.post('/', auth, async (req, res) => {
  const t = await Transaction.create({ ...req.body, userId: req.user.id, raw: req.body });
  res.json(t);
});

router.put('/:id', auth, async (req, res) => {
  const t = await Transaction.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
  res.json(t);
});

router.get('/', auth, async (req, res) => {
  const rows = await Transaction.find({ userId: req.user.id }).sort({ date: -1 }).lean();
  res.json({ rows });
});

module.exports = router;
