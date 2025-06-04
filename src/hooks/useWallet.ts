
import { useState, useEffect } from 'react';
import { fetchWallet, simulateRoundUp, addDeposit } from '@/lib/wallet';
import { Wallet, Transaction } from '@/types/wallet';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@/lib/auth';

export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getWallet = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated first
      const user = await getCurrentUser();
      if (!user) {
        setError('User not authenticated');
        navigate('/login');
        return;
      }
      
      const walletData = await fetchWallet();
      if (walletData) {
        setWallet(walletData);
        setTransactions(walletData.transactions || []);
        setError(null);
      }
    } catch (err: any) {
      console.error('Wallet fetch error:', err);
      setError(err?.message || 'Failed to fetch wallet data');
      toast({
        title: "Error",
        description: "Failed to load wallet data. Please try again.",
        variant: "destructive",
      });
      
      // If authentication error, redirect to login
      if (err.message === 'User not authenticated') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
      setTransactionsLoading(false);
    }
  };

  // Add a transaction and update the wallet
  const addRoundUp = async (amount: number, description: string) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to continue.",
          variant: "destructive",
        });
        navigate('/login');
        return null;
      }

      const transaction = await simulateRoundUp(amount, description);
      
      if (transaction) {
        // Refresh wallet data to ensure we have the latest balance
        await getWallet();
        
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
      
      // If authentication error, redirect to login
      if (err.message === 'User not authenticated') {
        navigate('/login');
      }
      
      return null;
    }
  };

  // Add a direct deposit
  const addDirectDeposit = async (amount: number, description: string) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to continue.",
          variant: "destructive",
        });
        navigate('/login');
        return null;
      }

      const transaction = await addDeposit(amount, description);
      
      if (transaction) {
        // Refresh wallet data to ensure we have the latest balance
        await getWallet();
        
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
      
      // If authentication error, redirect to login
      if (err.message === 'User not authenticated') {
        navigate('/login');
      }
      
      return null;
    }
  };

  useEffect(() => {
    // Check if Supabase is configured before trying to fetch wallet
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    /*if (!supabaseUrl || !supabaseKey) {
      setLoading(false);
      setTransactionsLoading(false);
      setError('Supabase configuration is missing. Please connect to Supabase in the interface.');
      toast({
        title: "Connection missing",
        description: "Please connect to Supabase using the green button at the top right.",
        variant: "destructive",
      });
      return;
    }*/
    
    getWallet();
  }, []);

  return {
    wallet,
    transactions,
    loading,
    transactionsLoading,
    error,
    refreshWallet: getWallet,
    addRoundUp,
    addDirectDeposit
  };
};
