
import { useState, useEffect } from 'react';
import { fetchWallet, simulateRoundUp } from '@/lib/api';
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

  useEffect(() => {
    // Only try to fetch wallet if Supabase is properly initialized
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl) {
      getWallet();
    } else {
      setLoading(false);
      setError('Supabase configuration is missing');
      console.error('Missing Supabase environment variables');
    }
  }, []);

  return {
    wallet,
    loading,
    error,
    refreshWallet: getWallet,
    addRoundUp
  };
};
