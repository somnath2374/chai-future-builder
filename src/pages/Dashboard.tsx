
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { signOut, getCurrentUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';
import { useEduScore } from '@/hooks/useEduScore';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardStats from '@/components/DashboardStats';
import WalletTabContent from '@/components/WalletTabContent';
import EducationTabContent from '@/components/EducationTabContent';
import PaymentsTabContent from '@/components/PaymentsTabContent';
import SettingsTabContent from '@/components/SettingsTabContent';
import { 
  Wallet, 
  GraduationCap, 
  CreditCard,
  Settings
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('wallet');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Use our custom hooks
  const { wallet, loading: walletLoading, addRoundUp, addDirectDeposit, transactions, transactionsLoading } = useWallet();
  const { score, loading: scoreLoading, completeLesson } = useEduScore();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRoundUpSubmit = async (amount: number, description: string) => {
    const transaction = await addRoundUp(amount, description);
    return transaction;
  };

  const handleDepositSubmit = async (amount: number, description: string) => {
    const transaction = await addDirectDeposit(amount, description);
    return transaction;
  };

  const handleLessonComplete = async (lessonId: string) => {
    const result = await completeLesson(lessonId);
    if (result?.success) {
      toast({
        title: "Lesson completed!",
        description: `You earned ${result.scoreEarned} points!`,
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-educhain-purple mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} onSignOut={handleSignOut} />

      <div className="container mx-auto px-4 py-8">
        <DashboardStats wallet={wallet} score={score} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="wallet" className="space-y-6">
            <WalletTabContent
              wallet={wallet}
              walletLoading={walletLoading}
              transactions={transactions || []}
              transactionsLoading={transactionsLoading}
              onAddRoundUp={handleRoundUpSubmit}
            />
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <EducationTabContent />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <PaymentsTabContent
              transactions={transactions || []}
              transactionsLoading={transactionsLoading}
              onAddDeposit={handleDepositSubmit}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsTabContent user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
