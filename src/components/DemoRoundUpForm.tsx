
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CircleDollarSign } from "lucide-react";

interface DemoRoundUpFormProps {
  onAddRoundUp: (amount: number, description: string) => Promise<any>;
  loading?: boolean;
}

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    { message: "Amount must be greater than 0" }
  ),
  description: z.string().optional(),
});

const DemoRoundUpForm: React.FC<DemoRoundUpFormProps> = ({ 
  onAddRoundUp, 
  loading = false 
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  // Calculate demo round-up amount (5-10 rupees)
  const calculateDemoRoundUp = () => {
    return Math.floor((Math.random() * 5 + 5) * 100) / 100;
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const originalAmount = parseFloat(data.amount);
    
    console.log(`Demo round-up: Purchase of ₹${originalAmount}, round-up will be calculated automatically`);
    
    await onAddRoundUp(originalAmount, data.description || "Demo purchase with round-up");
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5 text-educhain-purple" />
          Demo Round-Up Purchase
        </CardTitle>
        <CardDescription>
          Simulate a purchase with automatic round-up savings
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
              <div className="text-educhain-darkPurple">
                ₹5-10 will be automatically rounded up and saved to your wallet
              </div>
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
              className="w-full bg-gradient-to-r from-educhain-purple to-educhain-darkPurple hover:opacity-90"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Simulate Purchase'}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-1">
              Demo purchase for testing round-up feature
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DemoRoundUpForm;
