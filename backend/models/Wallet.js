const mongoose = require('mongoose');
const Transaction = require('./Transaction');

const walletSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true, unique: true },
  balance: { type: Number, required: true },
  roundup_total: { type: Number, required: true },
  rewards_earned: { type: Number, required: true },
  last_transaction_date: { type: Date, default: Date.now },
  transactions: [Transaction.schema],
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet; 