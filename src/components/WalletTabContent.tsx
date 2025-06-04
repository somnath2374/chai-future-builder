
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import WalletCard from '@/components/WalletCard';
import TransactionsList from '@/components/TransactionsList';
import AddTransactionForm from '@/components/AddTransactionForm';
import { Wallet, Transaction } from '@/types/wallet';

interface WalletTabContentProps {
  wallet: Wallet | null;
  walletLoading: boolean;
  transactions: Transaction[];
  transactionsLoading: boolean;
  onAddRoundUp: (amount: number, description: string) => Promise<any>;
}

const WalletTabContent: React.FC<WalletTabContentProps> = ({
  wallet,
  walletLoading,
  transactions,
  transactionsLoading,
  onAddRoundUp
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <WalletCard wallet={wallet} loading={walletLoading} />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Add Round-up
            </CardTitle>
            <CardDescription>
              Simulate a purchase and add the round-up to your savings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddTransactionForm onAddRoundUp={onAddRoundUp} />
          </CardContent>
        </Card>
      </div>
      <div>
        <TransactionsList transactions={transactions} loading={transactionsLoading} />
      </div>
    </div>
  );
};

export default WalletTabContent;
