
export interface Transaction {
  id: string;
  type: 'round-up' | 'deposit' | 'withdrawal' | 'reward';
  amount: number;
  status: string;
  description: string;
  created_at: string;
  wallet_id: string; // Required foreign key to wallets table
  user_id?: string; // Optional foreign key to auth.users table
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  roundup_total: number;
  rewards_earned: number;
  last_transaction_date: string;
  transactions: Transaction[];
}
