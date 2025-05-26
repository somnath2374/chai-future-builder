
import React from 'react';
import RazorpayPaymentForm from "@/components/RazorpayPaymentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface DepositFormProps {
  onInitiatePayment?: (amount: number, description: string) => Promise<any>;
  paymentLoading?: boolean;
}

const DepositForm: React.FC<DepositFormProps> = ({ 
  onInitiatePayment,
  paymentLoading = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-educhain-purple" />
          Add Funds
        </CardTitle>
      </CardHeader>
      <CardContent>
        {onInitiatePayment ? (
          <RazorpayPaymentForm 
            onInitiatePayment={onInitiatePayment} 
            loading={paymentLoading} 
          />
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Razorpay payments are not configured.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DepositForm;
