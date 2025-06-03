
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { PiggyBank } from "lucide-react";
import { useWallet } from '@/hooks/useWallet';
import { useAdmin } from '@/hooks/useAdmin';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardCards from '@/components/DashboardCards';
import DashboardContent from '@/components/DashboardContent';
import { signOut, getCurrentUser } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { wallet, loading, paymentLoading, initiateRazorpayPayment, refreshWallet } = useWallet();
  const { isAdminAuthenticated } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const user = await getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }
        setUserName(user.email?.split('@')[0] || 'User');
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
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

  // Check if the URL contains payment success or failure parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const txnId = urlParams.get('txnId');
    
    if (status && txnId) {
      // Clear URL parameters without reloading the page
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Handle payment status
      if (status === 'SUCCESS') {
        toast({
          title: "Payment successful!",
          description: `Your payment has been successfully processed. Transaction ID: ${txnId}`,
          variant: "default",
        });
        
        // Refresh wallet data to show updated balance
        setTimeout(() => {
          refreshWallet();
        }, 2000);
      } else {
        toast({
          title: "Payment failed",
          description: `Your payment was not successful. Please try again.`,
          variant: "destructive",
        });
      }
    }
  }, [refreshWallet, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <PiggyBank className="h-12 w-12 mx-auto mb-4 text-educhain-purple animate-pulse" />
          <h2 className="text-xl font-semibold">Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        userName={userName}
        onSignOut={handleSignOut}
      />

      <DashboardCards 
        wallet={wallet}
        loading={loading}
      />

      <DashboardContent
        wallet={wallet}
        loading={loading}
        paymentLoading={paymentLoading}
        isAdminAuthenticated={isAdminAuthenticated}
        onRefreshWallet={refreshWallet}
        onInitiatePayment={initiateRazorpayPayment}
      />
    </div>
  );
};

export default Dashboard;
