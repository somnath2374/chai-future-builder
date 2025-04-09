
import { createClient } from '@supabase/supabase-js';
import { Wallet, Transaction } from '@/types/wallet';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if environment variables are set
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your Supabase connection.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Auth functions
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

// Wallet functions
export const fetchWallet = async (): Promise<Wallet | null> => {
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }
  
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.user.id)
    .single();
  
  if (error) {
    console.error('Error fetching wallet:', error);
    return null;
  }
  
  // Now fetch transactions for this wallet
  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .eq('wallet_id', data.id)
    .order('created_at', { ascending: false });
  
  if (txError) {
    console.error('Error fetching transactions:', txError);
  }
  
  return {
    ...data,
    transactions: transactions || []
  } as Wallet;
};

// Transaction functions
export const simulateRoundUp = async (amount: number, description: string): Promise<Transaction | null> => {
  // In a real app, this would connect to a payment processor
  // For now, we'll simulate it by directly adding a transaction
  
  const { data: user } = await supabase.auth.getUser();
  
  if (!user.user) {
    throw new Error('User not authenticated');
  }
  
  // First get the wallet
  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('id, balance, roundup_total')
    .eq('user_id', user.user.id)
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
      wallet_id: wallet.id,
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
  await supabase
    .from('wallets')
    .update({ 
      balance: wallet.balance + roundupAmount,
      roundup_total: wallet.roundup_total + roundupAmount,
      last_transaction_date: new Date().toISOString()
    })
    .eq('id', wallet.id);
  
  return data as Transaction;
};
