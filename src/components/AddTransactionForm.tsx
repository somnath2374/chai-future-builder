
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddTransactionFormProps {
  onAddRoundUp: (amount: number, description: string) => Promise<any>;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onAddRoundUp }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }
    
    setLoading(true);
    try {
      await onAddRoundUp(parseFloat(amount), description || 'Manual round-up');
      // Reset form
      setAmount('');
      setDescription('');
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Simulate Round-Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Original Amount (₹)
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="46.50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <div className="text-sm text-muted-foreground">
              We'll round this up to the nearest rupee and save the difference.
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              placeholder="Coffee at Starbucks"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-educhain-purple to-educhain-darkPurple hover:opacity-90"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Simulate Round-Up'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTransactionForm;
