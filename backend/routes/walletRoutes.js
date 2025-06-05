const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Get wallet by user_id
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOne({ user_id: userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    res.status(200).json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new wallet
router.post('/', async (req, res) => {
  try {
    const { id, user_id, balance, roundup_total, rewards_earned } = req.body;
    const newWallet = new Wallet({
      id,
      user_id,
      balance,
      roundup_total,
      rewards_earned,
    });
    const savedWallet = await newWallet.save();
    res.status(201).json(savedWallet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Record a new transaction and update wallet
router.post('/transaction', async (req, res) => {
  try {
    const { wallet_id, type, amount, description } = req.body;

    const wallet = await Wallet.findOne({ id: wallet_id });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    const newTransaction = new Transaction({
      id: new mongoose.Types.ObjectId().toString(), // Generate a unique ID for the transaction
      wallet_id,
      type,
      amount,
      description,
    });

    wallet.transactions.push(newTransaction);

    if (type === 'deposit' || type === 'reward') {
      wallet.balance += amount;
    } else if (type === 'withdrawal' || type === 'round-up') {
      wallet.balance -= amount;
    }

    if (type === 'round-up') {
      wallet.roundup_total += amount;
    }
    if (type === 'reward') {
      wallet.rewards_earned += amount;
    }

    wallet.last_transaction_date = new Date();

    await wallet.save();
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all transactions for a wallet
router.get('/:walletId/transactions', async (req, res) => {
  try {
    const { walletId } = req.params;
    const wallet = await Wallet.findOne({ id: walletId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    res.status(200).json(wallet.transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 