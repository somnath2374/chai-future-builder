
import { supabase, checkSupabaseConfig } from './supabase';
import { Wallet, Transaction } from '@/types/wallet';
import { getCurrentUser } from './auth';

export const fetchWallet = async (): Promise<Wallet | null> => {
  checkSupabaseConfig();
  
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (error) {
    console.error('Error fetching wallet:', error);
    return null;
  }
  
  // Now fetch transactions for this wallet
  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .eq('wallet_id', data?.id)
    .order('created_at', { ascending: false });
  
  if (txError) {
    console.error('Error fetching transactions:', txError);
  }
  
  return {
    ...data,
    transactions: transactions || []
  } as Wallet;
};

export const simulateRoundUp = async (amount: number, description: string): Promise<Transaction | null> => {
  checkSupabaseConfig();
  
  // In a real app, this would connect to a payment processor
  // For now, we'll simulate it by directly adding a transaction
  
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // First get the wallet
  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('id, balance, roundup_total')
    .eq('user_id', user.id)
    .single();
  
  if (walletError) {
    console.error('Error fetching wallet:', walletError);
    return null;
  }
  
  // Calculate roundup (next whole unit)
  const originalAmount = amount;
  const roundedAmount = Math.ceil(amount);
  const roundupAmount = roundedAmount - originalAmount;
  
  // Add transaction
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      wallet_id: wallet?.id,
      type: 'round-up',
      amount: roundupAmount,
      description: description,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating transaction:', error);
    return null;
  }
  
  // Update wallet balance
  if (wallet) {
    await supabase
      .from('wallets')
      .update({ 
        balance: wallet.balance + roundupAmount,
        roundup_total: wallet.roundup_total + roundupAmount,
        last_transaction_date: new Date().toISOString()
      })
      .eq('id', wallet.id);
  }
  
  return data as Transaction;
};

export const addDeposit = async (amount: number, description: string): Promise<Transaction | null> => {
  checkSupabaseConfig();
  
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // First get the wallet
  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('id, balance')
    .eq('user_id', user.id)
    .single();
  
  if (walletError) {
    console.error('Error fetching wallet:', walletError);
    return null;
  }
  
  // Add transaction
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      wallet_id: wallet?.id,
      type: 'deposit',
      amount: amount,
      description: description || 'Manual deposit',
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating transaction:', error);
    return null;
  }
  
  // Update wallet balance
  if (wallet) {
    await supabase
      .from('wallets')
      .update({ 
        balance: wallet.balance + amount,
        last_transaction_date: new Date().toISOString()
      })
      .eq('id', wallet.id);
  }
  
  return data as Transaction;
};
