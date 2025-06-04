
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { signOut, getCurrentUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';
import { useEduScore } from '@/hooks/useEduScore';
import WalletCard from '@/components/WalletCard';
import TransactionsList from '@/components/TransactionsList';
import AddTransactionForm from '@/components/AddTransactionForm';
import EduScoreCard from '@/components/EduScoreCard';
import LearningProgress from '@/components/LearningProgress';
import FinancialTips from '@/components/FinancialTips';
import DepositForm from '@/components/DepositForm';
import DeleteAccountDialog from '@/components/DeleteAccountDialog';
import { 
  User, 
  LogOut, 
  Wallet, 
  GraduationCap, 
  TrendingUp, 
  PlusCircle,
  Settings,
  CreditCard
} from "lucide-react";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('wallet');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Use our custom hooks
  const { wallet, loading: walletLoading, addRoundUp, addDirectDeposit } = useWallet();
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-educhain-darkPurple">
              Edu<span className="text-educhain-purple">Chain</span>
            </h1>
            <p className="text-sm text-gray-600">Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</span>
            </div>
            <Button 
              onClick={handleSignOut}
              variant="ghost" 
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
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

        {/* Main Content Tabs */}
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
                    <AddTransactionForm onSubmit={handleRoundUpSubmit} />
                  </CardContent>
                </Card>
              </div>
              <div>
                <TransactionsList />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <EduScoreCard score={score} loading={scoreLoading} />
                <LearningProgress onLessonComplete={handleLessonComplete} />
              </div>
              <div>
                <FinancialTips />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Direct Deposit</CardTitle>
                  <CardDescription>
                    Add money directly to your wallet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DepositForm onSubmit={handleDepositSubmit} />
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
                  <TransactionsList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Manage your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <Input 
                      value={user.user_metadata?.full_name || ''} 
                      disabled 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input 
                      value={user.email || ''} 
                      disabled 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Member Since</label>
                    <Input 
                      value={new Date(user.created_at).toLocaleDateString()} 
                      disabled 
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>
                    Manage your account settings and data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Security</h4>
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h4>
                    <p className="text-xs text-gray-500 mb-3">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <DeleteAccountDialog />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
