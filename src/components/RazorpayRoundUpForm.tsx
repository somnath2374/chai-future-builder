
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CreditCard } from "lucide-react";

interface RazorpayRoundUpFormProps {
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

const RazorpayRoundUpForm: React.FC<RazorpayRoundUpFormProps> = ({ 
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
    await onInitiatePayment(parseFloat(data.amount), data.description || "Round-up payment");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-educhain-purple" />
          Round-Up Payment
        </CardTitle>
        <CardDescription>
          Pay for your purchase and save change automatically
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Amount (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="46.50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="px-3 py-2 bg-educhain-lightPurple rounded-md text-sm">
              <span className="font-medium">Note: </span>
              <span className="text-educhain-darkPurple">You'll pay the exact amount, and change will be automatically saved to your wallet</span>
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Coffee at Starbucks"
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
      </CardContent>
    </Card>
  );
};

export default RazorpayRoundUpForm;
