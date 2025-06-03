
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PiggyBank } from "lucide-react";

interface DemoDepositFormProps {
  onAddDeposit: (amount: number, description: string) => Promise<any>;
  loading?: boolean;
}

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    { message: "Amount must be greater than 0" }
  ),
  description: z.string().optional(),
});

const DemoDepositForm: React.FC<DemoDepositFormProps> = ({ 
  onAddDeposit, 
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
    await onAddDeposit(parseFloat(data.amount), data.description || "Demo deposit");
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-educhain-purple" />
          Add Demo Money
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                      placeholder="Demo money for testing"
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
              {loading ? 'Adding...' : 'Add Demo Money'}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-1">
              This is demo money for testing purposes
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DemoDepositForm;
