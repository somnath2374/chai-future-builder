
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import DepositForm from '@/components/DepositForm';
import TransactionsList from '@/components/TransactionsList';
import { Transaction } from '@/types/wallet';

interface PaymentsTabContentProps {
  transactions: Transaction[];
  transactionsLoading: boolean;
  onAddDeposit: (amount: number, description: string) => Promise<any>;
}

const PaymentsTabContent: React.FC<PaymentsTabContentProps> = ({
  transactions,
  transactionsLoading,
  onAddDeposit
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Direct Deposit</CardTitle>
          <CardDescription>
            Add money directly to your wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DepositForm onAddDeposit={onAddDeposit} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            View your recent transactions and deposits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionsList transactions={transactions} loading={transactionsLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsTabContent;
