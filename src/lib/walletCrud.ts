
import { supabase, checkSupabaseConfig } from './supabase';
import { getCurrentUser } from './auth';
import { Transaction } from '@/types/wallet';

export interface CreateTransactionData {
  type: 'deposit' | 'round-up' | 'withdrawal' | 'reward';
  amount: number;
  description?: string;
  status?: 'pending' | 'success' | 'failed';
}

export interface UpdateTransactionData {
  type?: 'deposit' | 'round-up' | 'withdrawal' | 'reward';
  amount?: number;
  description?: string;
  status?: 'pending' | 'success' | 'failed';
}

// Create a new transaction
export const createTransaction = async (data: CreateTransactionData): Promise<Transaction | null> => {
  checkSupabaseConfig();
  
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    // Get user's wallet
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (walletError || !wallet) {
      throw new Error('Wallet not found');
    }

    // Create transaction
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        wallet_id: wallet.id,
        user_id: user.id,
        type: data.type,
        amount: data.amount,
        description: data.description || '',
        status: data.status || 'success',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }

    // Update wallet balance if transaction is successful
    if (data.status === 'success' || !data.status) {
      await updateWalletBalance(wallet.id, data.amount, data.type);
    }

    return transaction as Transaction;
  } catch (error) {
    console.error('Create transaction error:', error);
    throw error;
  }
};

// Read/fetch transactions
export const fetchTransactions = async (limit?: number): Promise<Transaction[]> => {
  checkSupabaseConfig();
  
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    let query = supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }

    return data as Transaction[];
  } catch (error) {
    console.error('Fetch transactions error:', error);
    throw error;
  }
};

// Update a transaction
export const updateTransaction = async (id: string, data: UpdateTransactionData): Promise<Transaction | null> => {
  checkSupabaseConfig();
  
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .update(data)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }

    return transaction as Transaction;
  } catch (error) {
    console.error('Update transaction error:', error);
    throw error;
  }
};

// Delete a transaction
export const deleteTransaction = async (id: string): Promise<boolean> => {
  checkSupabaseConfig();
  
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    // First get the transaction to adjust wallet balance
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('wallet_id, amount, type, status')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      console.error('Error fetching transaction for deletion:', fetchError);
      throw fetchError;
    }

    // Delete the transaction
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }

    // Adjust wallet balance if transaction was successful
    if (transaction.status === 'success') {
      await updateWalletBalance(transaction.wallet_id, -transaction.amount, transaction.type);
    }

    return true;
  } catch (error) {
    console.error('Delete transaction error:', error);
    throw error;
  }
};

// Helper function to update wallet balance
const updateWalletBalance = async (walletId: string, amount: number, type: string) => {
  try {
    const { data: wallet, error: fetchError } = await supabase
      .from('wallets')
      .select('balance, roundup_total')
      .eq('id', walletId)
      .single();

    if (fetchError || !wallet) {
      throw new Error('Wallet not found');
    }

    let newBalance = wallet.balance;
    let newRoundupTotal = wallet.roundup_total;

    // Adjust balance based on transaction type
    if (type === 'deposit' || type === 'round-up' || type === 'reward') {
      newBalance += amount;
      if (type === 'round-up') {
        newRoundupTotal += amount;
      }
    } else if (type === 'withdrawal') {
      newBalance -= amount;
    }

    const { error: updateError } = await supabase
      .from('wallets')
      .update({
        balance: newBalance,
        roundup_total: newRoundupTotal,
        last_transaction_date: new Date().toISOString()
      })
      .eq('id', walletId);

    if (updateError) {
      throw updateError;
    }
  } catch (error) {
    console.error('Error updating wallet balance:', error);
    throw error;
  }
};
