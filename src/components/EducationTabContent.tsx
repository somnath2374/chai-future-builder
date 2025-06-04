
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import EduScoreCard from '@/components/EduScoreCard';
import LearningProgress from '@/components/LearningProgress';
import FinancialTips from '@/components/FinancialTips';

const EducationTabContent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Quick Access to Full Lessons Page */}
      <div className="bg-gradient-to-r from-educhain-purple to-educhain-darkPurple rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Complete Learning Center</h3>
            <p className="text-purple-100 mb-4">
              Access all video courses, interactive lessons, and quizzes in one place
            </p>
          </div>
          <BookOpen className="h-12 w-12 text-purple-200" />
        </div>
        <Button 
          onClick={() => navigate('/lessons')}
          className="bg-white text-educhain-purple hover:bg-gray-100 font-semibold"
        >
          View All Lessons <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <EduScoreCard />
          <LearningProgress />
        </div>
        <div>
          <FinancialTips />
        </div>
      </div>
    </div>
  );
};

export default EducationTabContent;
