
import { useState, useEffect } from 'react';
import { fetchWallet, simulateRoundUp, addDeposit } from '@/lib/wallet';
import { Wallet, Transaction } from '@/types/wallet';
import { useToast } from '@/hooks/use-toast';

export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getWallet = async () => {
    try {
      setLoading(true);
      const walletData = await fetchWallet();
      setWallet(walletData);
      setError(null);
    } catch (err: any) {
      console.error('Wallet fetch error:', err);
      setError(err?.message || 'Failed to fetch wallet data');
      toast({
        title: "Error",
        description: "Failed to load wallet data. Please check your Supabase connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a transaction and update the wallet
  const addRoundUp = async (amount: number, description: string) => {
    try {
      const transaction = await simulateRoundUp(amount, description);
      if (transaction && wallet) {
        // Update local state
        setWallet({
          ...wallet,
          balance: wallet.balance + transaction.amount,
          roundup_total: wallet.roundup_total + transaction.amount,
          last_transaction_date: transaction.created_at,
          transactions: [transaction, ...wallet.transactions]
        });
        
        toast({
          title: "Round-up saved!",
          description: `₹${transaction.amount.toFixed(2)} added to your wallet.`,
        });
        
        return transaction;
      }
      return null;
    } catch (err: any) {
      console.error('Round-up error:', err);
      toast({
        title: "Transaction failed",
        description: err?.message || "Could not process your round-up. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Add a direct deposit
  const addDirectDeposit = async (amount: number, description: string) => {
    try {
      const transaction = await addDeposit(amount, description);
      if (transaction && wallet) {
        // Update local state
        setWallet({
          ...wallet,
          balance: wallet.balance + transaction.amount,
          last_transaction_date: transaction.created_at,
          transactions: [transaction, ...wallet.transactions]
        });
        
        toast({
          title: "Deposit successful!",
          description: `₹${transaction.amount.toFixed(2)} added to your wallet.`,
        });
        
        return transaction;
      }
      return null;
    } catch (err: any) {
      console.error('Deposit error:', err);
      toast({
        title: "Transaction failed",
        description: err?.message || "Could not process your deposit. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    // Check if Supabase is configured before trying to fetch wallet
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      setLoading(false);
      setError('Supabase configuration is missing. Please connect to Supabase in the interface.');
      toast({
        title: "Connection missing",
        description: "Please connect to Supabase using the green button at the top right.",
        variant: "destructive",
      });
      return;
    }
    
    getWallet();
  }, []);

  return {
    wallet,
    loading,
    error,
    refreshWallet: getWallet,
    addRoundUp,
    addDirectDeposit
  };
};
