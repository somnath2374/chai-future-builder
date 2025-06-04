
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, GraduationCap, TrendingUp } from "lucide-react";
import { Wallet as WalletType } from '@/types/wallet';

interface DashboardStatsProps {
  wallet: WalletType | null;
  score: any;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ wallet, score }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
              <p className="text-2xl font-bold text-educhain-darkPurple">
                ₹{wallet?.balance?.toFixed(2) || '0.00'}
              </p>
            </div>
            <Wallet className="h-8 w-8 text-educhain-purple" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">EduScore</p>
              <p className="text-2xl font-bold text-educhain-darkPurple">
                {score?.score || 0}
              </p>
            </div>
            <GraduationCap className="h-8 w-8 text-educhain-purple" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Round-ups</p>
              <p className="text-2xl font-bold text-educhain-darkPurple">
                ₹{wallet?.roundup_total?.toFixed(2) || '0.00'}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-educhain-purple" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
