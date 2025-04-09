
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
    } catch (err) {
      setError('Failed to fetch wallet data');
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load wallet data. Please try again.",
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
    } catch (err) {
      console.error(err);
      toast({
        title: "Transaction failed",
        description: "Could not process your round-up. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  return {
    wallet,
    loading,
    error,
    refreshWallet: getWallet,
    addRoundUp
  };
};
