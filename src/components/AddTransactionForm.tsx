
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CircleDollarSign } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface AddTransactionFormProps {
  onAddRoundUp: (amount: number, description: string) => Promise<any>;
}

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    { message: "Amount must be greater than 0" }
  ),
  description: z.string().optional(),
});

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onAddRoundUp }) => {
  const [loading, setLoading] = useState(false);
  const [roundupAmount, setRoundupAmount] = useState<number | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      description: "",
    },
  });

  // Calculate the roundup amount when the original amount changes
  const calculateRoundup = (value: string) => {
    if (!value || isNaN(parseFloat(value))) {
      setRoundupAmount(null);
      return;
    }
    
    const originalAmount = parseFloat(value);
    const roundedAmount = Math.ceil(originalAmount);
    const diff = roundedAmount - originalAmount;
    
    // Show the roundup amount with 2 decimal places
    setRoundupAmount(parseFloat(diff.toFixed(2)));
  };

  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'amount') {
        calculateRoundup(value.amount as string);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await onAddRoundUp(parseFloat(data.amount), data.description || "Manual round-up");
      form.reset();
      setRoundupAmount(null);
    } catch (error) {
      console.error('Error adding round-up:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5 text-educhain-purple" />
          Simulate Round-Up
        </CardTitle>
        <CardDescription>
          Round up a purchase amount and save the difference
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
                  <FormLabel>Original Amount (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="46.50"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        calculateRoundup(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {roundupAmount !== null && (
              <div className="px-3 py-2 bg-educhain-lightPurple rounded-md text-sm">
                <span className="font-medium">Roundup amount: </span>
                <span className="text-educhain-darkPurple">₹{roundupAmount.toFixed(2)}</span>
              </div>
            )}
            
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
              {loading ? 'Processing...' : 'Save Round-Up'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddTransactionForm;
