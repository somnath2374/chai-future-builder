
import React from 'react';
import EduScoreCard from '@/components/EduScoreCard';
import LearningProgress from '@/components/LearningProgress';
import FinancialTips from '@/components/FinancialTips';

const EducationTabContent: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <EduScoreCard />
        <LearningProgress />
      </div>
      <div>
        <FinancialTips />
      </div>
    </div>
  );
};

export default EducationTabContent;
