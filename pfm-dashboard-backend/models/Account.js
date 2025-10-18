const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    item_id: { type: String, required: true, unique: true },
    access_token: { type: String, required: true },
    institution_name: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);
