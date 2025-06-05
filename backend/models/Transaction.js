const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['round-up', 'deposit', 'withdrawal', 'reward'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  wallet_id: { type: String, required: true },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 