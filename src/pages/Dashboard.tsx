import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BookOpen, Trophy, LogOut } from "lucide-react";
import { useWallet } from '@/hooks/useWallet';
import WalletCard from '@/components/WalletCard';
import TransactionsList from '@/components/TransactionsList';
import AddTransactionForm from '@/components/AddTransactionForm';
import { signOut, getCurrentUser } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { wallet, loading, addRoundUp, refreshWallet } = useWallet();
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

          <Card className="bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-educhain-purple" />
                EduScore
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">720</div>
              <div className="text-sm text-green-600 mt-1">
                +15 points this week 📈
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-educhain-purple" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8 Lessons</div>
              <div className="text-sm text-muted-foreground mt-1">
                3 rewards available
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <TransactionsList 
              transactions={wallet?.transactions || []} 
              loading={loading} 
            />
          </div>
          <div>
            <AddTransactionForm onAddRoundUp={addRoundUp} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
