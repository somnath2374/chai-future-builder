
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDollarSign, ArrowDownCircle } from "lucide-react";
import RazorpayRoundUpForm from '@/components/RazorpayRoundUpForm';
import DepositForm from '@/components/DepositForm';
import FinancialTips from '@/components/FinancialTips';

interface PaymentTabsProps {
  onInitiatePayment: (amount: number, description: string) => Promise<any>;
  paymentLoading: boolean;
}

const PaymentTabs: React.FC<PaymentTabsProps> = ({ onInitiatePayment, paymentLoading }) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="roundup">
        <TabsList className="w-full">
          <TabsTrigger value="roundup" className="flex-1 flex items-center justify-center gap-2">
            <CircleDollarSign className="h-4 w-4" />
            <span>Round-Up</span>
          </TabsTrigger>
          <TabsTrigger value="deposit" className="flex-1 flex items-center justify-center gap-2">
            <ArrowDownCircle className="h-4 w-4" />
            <span>Deposit</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="roundup">
          <RazorpayRoundUpForm 
            onInitiatePayment={onInitiatePayment}
            loading={paymentLoading}
          />
        </TabsContent>
        <TabsContent value="deposit">
          <DepositForm 
            onInitiatePayment={onInitiatePayment}
            paymentLoading={paymentLoading}
          />
        </TabsContent>
      </Tabs>
      <FinancialTips />
    </div>
  );
};

export default PaymentTabs;
