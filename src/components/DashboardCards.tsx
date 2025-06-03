
import React from 'react';
import { Wallet } from '@/types/wallet';
import WalletCard from '@/components/WalletCard';
import EduScoreCard from '@/components/EduScoreCard';
import LearningProgress from '@/components/LearningProgress';

interface DashboardCardsProps {
  wallet: Wallet | null;
  loading: boolean;
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ wallet, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <WalletCard wallet={wallet} loading={loading} />
      <EduScoreCard />
      <LearningProgress />
    </div>
  );
};

export default DashboardCards;
