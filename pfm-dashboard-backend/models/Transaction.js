const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  item_id: { type: String, index: true },
  transaction_id: { type: String, unique: true, sparse: true }, // Plaid id
  name: String,
  amount: Number,
  date: String, // YYYY-MM-DD
  iso_currency_code: String,
  merchant_name: String,
  category: [String],
  appCategory: String,
  pending: Boolean,
  raw: Object
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
