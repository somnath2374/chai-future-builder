
import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet } from '@/types/wallet';
import TransactionsList from '@/components/TransactionsList';
import PaymentTabs from '@/components/PaymentTabs';
import TransactionManager from '@/components/TransactionManager';

interface DashboardContentProps {
  wallet: Wallet | null;
  loading: boolean;
  paymentLoading: boolean;
  isAdminAuthenticated: boolean;
  onRefreshWallet: () => void;
  onInitiatePayment: (amount: number, description: string) => Promise<any>;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  wallet,
  loading,
  paymentLoading,
  isAdminAuthenticated,
  onRefreshWallet,
  onInitiatePayment
}) => {
  return (
    <main className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Financial Dashboard</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRefreshWallet} 
          className="text-educhain-purple"
        >
          Refresh Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <TransactionsList 
            transactions={wallet?.transactions || []} 
            loading={loading} 
          />
        </div>
        <PaymentTabs 
          onInitiatePayment={onInitiatePayment}
          paymentLoading={paymentLoading}
        />
      </div>

      {/* Admin-only Transaction Management Section */}
      {isAdminAuthenticated && (
        <div className="mb-8">
          <TransactionManager 
            transactions={wallet?.transactions || []}
            onRefresh={onRefreshWallet}
          />
        </div>
      )}
    </main>
  );
};

export default DashboardContent;
