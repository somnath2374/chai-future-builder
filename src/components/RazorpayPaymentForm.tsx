
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CreditCard } from "lucide-react";

interface RazorpayPaymentFormProps {
  onInitiatePayment: (amount: number, description: string) => Promise<any>;
  loading?: boolean;
}

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    { message: "Amount must be greater than 0" }
  ),
  description: z.string().optional(),
});

const RazorpayPaymentForm: React.FC<RazorpayPaymentFormProps> = ({ 
  onInitiatePayment, 
  loading = false 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await onInitiatePayment(parseFloat(data.amount), data.description || "Razorpay deposit");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (₹)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="100.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Wallet deposit"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-educhain-purple to-educhain-darkPurple hover:opacity-90 flex items-center justify-center gap-2"
          disabled={loading}
        >
          <CreditCard className="h-4 w-4" />
          {loading ? 'Processing...' : 'Pay with Razorpay'}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-1">
          Secure payment powered by Razorpay
        </p>
      </form>
    </Form>
  );
};

export default RazorpayPaymentForm;
