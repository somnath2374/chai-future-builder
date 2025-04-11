
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useWallet } from '@/hooks/useWallet';
import WalletCard from '@/components/WalletCard';
import TransactionsList from '@/components/TransactionsList';
import AddTransactionForm from '@/components/AddTransactionForm';
import DepositForm from '@/components/DepositForm';
import LearningProgress from '@/components/LearningProgress';
import EduScoreCard from '@/components/EduScoreCard';
import FinancialTips from '@/components/FinancialTips';
import { signOut, getCurrentUser } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { wallet, loading, addRoundUp, addDirectDeposit, refreshWallet } = useWallet();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setUserName(user.email?.split('@')[0] || 'User');
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-educhain-darkPurple">
              Edu<span className="text-educhain-purple">Chain</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <span className="font-medium">Welcome, {userName || 'User'}</span>
            </div>
            <Button variant="outline" size="sm" className="gap-1" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <h2 className="text-2xl font-bold mb-6">Your Financial Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <WalletCard wallet={wallet} loading={loading} />
          <EduScoreCard />
          <LearningProgress />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <TransactionsList 
              transactions={wallet?.transactions || []} 
              loading={loading} 
            />
          </div>
          <div className="space-y-6">
            <Tabs defaultValue="roundup">
              <TabsList className="w-full">
                <TabsTrigger value="roundup" className="flex-1">Round-Up</TabsTrigger>
                <TabsTrigger value="deposit" className="flex-1">Deposit</TabsTrigger>
              </TabsList>
              <TabsContent value="roundup">
                <AddTransactionForm onAddRoundUp={addRoundUp} />
              </TabsContent>
              <TabsContent value="deposit">
                <DepositForm onAddDeposit={addDirectDeposit} />
              </TabsContent>
            </Tabs>
            <FinancialTips />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
