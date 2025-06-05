const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const EduScore = require('../models/EduScore');

router.post('/supabase', async (req, res) => {
  try {
    const payload = req.body;
    const { type, table, record, old_record } = payload;

    console.log(`Webhook received: Type - ${type}, Table - ${table}`);

    if (table === 'wallets') {
      if (type === 'INSERT' || type === 'UPDATE') {
        await Wallet.findOneAndUpdate(
          { id: record.id },
          {
            user_id: record.user_id,
            balance: record.balance,
            roundup_total: record.roundup_total,
            rewards_earned: record.rewards_earned,
            last_transaction_date: record.last_transaction_date,
          },
          { upsert: true, new: true }
        );
        console.log(`Wallet ${type === 'INSERT' ? 'created' : 'updated'} in MongoDB: ${record.id}`);
      } else if (type === 'DELETE') {
        await Wallet.deleteOne({ id: old_record.id });
        console.log(`Wallet deleted from MongoDB: ${old_record.id}`);
      }
    } else if (table === 'transactions') {
      if (type === 'INSERT' || type === 'UPDATE') {
        // For transactions, we need to find the parent wallet and update its embedded transactions array
        const wallet = await Wallet.findOne({ id: record.wallet_id });
        if (wallet) {
          const existingTransactionIndex = wallet.transactions.findIndex(t => t.id === record.id);
          if (existingTransactionIndex > -1) {
            // Update existing transaction
            wallet.transactions[existingTransactionIndex] = {
              id: record.id,
              type: record.type,
              amount: record.amount,
              description: record.description,
              created_at: record.created_at,
              wallet_id: record.wallet_id,
            };
          } else {
            // Add new transaction
            wallet.transactions.push({
              id: record.id,
              type: record.type,
              amount: record.amount,
              description: record.description,
              created_at: record.created_at,
              wallet_id: record.wallet_id,
            });
          }
          await wallet.save();
          console.log(`Transaction ${type === 'INSERT' ? 'added' : 'updated'} in Wallet ${record.wallet_id} in MongoDB: ${record.id}`);
        } else {
          console.warn(`Wallet with ID ${record.wallet_id} not found for transaction ${record.id}`);
        }
      } else if (type === 'DELETE') {
        const wallet = await Wallet.findOne({ id: old_record.wallet_id });
        if (wallet) {
          wallet.transactions = wallet.transactions.filter(t => t.id !== old_record.id);
          await wallet.save();
          console.log(`Transaction deleted from Wallet ${old_record.wallet_id} in MongoDB: ${old_record.id}`);
        } else {
          console.warn(`Wallet with ID ${old_record.wallet_id} not found for deleting transaction ${old_record.id}`);
        }
      }
    } else if (table === 'edu_scores') {
      if (type === 'INSERT' || type === 'UPDATE') {
        await EduScore.findOneAndUpdate(
          { user_id: record.user_id },
          {
            score: record.score,
            completed_lessons: record.completed_lessons,
            last_updated: record.last_updated,
          },
          { upsert: true, new: true }
        );
        console.log(`EduScore ${type === 'INSERT' ? 'created' : 'updated'} in MongoDB for user: ${record.user_id}`);
      } else if (type === 'DELETE') {
        await EduScore.deleteOne({ user_id: old_record.user_id });
        console.log(`EduScore deleted from MongoDB for user: ${old_record.user_id}`);
      }
    }

    res.status(200).send('Webhook received and processed');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ message: 'Error processing webhook', error: error.message });
  }
});

module.exports = router; 