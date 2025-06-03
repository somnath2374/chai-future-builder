
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Transaction } from '@/types/wallet';
import { useToast } from '@/hooks/use-toast';
import { createTransaction, updateTransaction, deleteTransaction } from '@/lib/walletCrud';

interface TransactionManagerProps {
  transactions: Transaction[];
  onRefresh: () => void;
}

const TransactionManager: React.FC<TransactionManagerProps> = ({ transactions, onRefresh }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    description: '',
    status: 'success'
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      type: '',
      amount: '',
      description: '',
      status: 'success'
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createTransaction({
        type: formData.type as any,
        amount: parseFloat(formData.amount),
        description: formData.description,
        status: formData.status as any
      });
      
      toast({
        title: "Transaction created",
        description: "New transaction has been added successfully.",
      });
      
      resetForm();
      setIsCreateOpen(false);
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create transaction.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      description: transaction.description || '',
      status: transaction.status
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!editingTransaction) return;
    
    try {
      await updateTransaction(editingTransaction.id, {
        type: formData.type as any,
        amount: parseFloat(formData.amount),
        description: formData.description,
        status: formData.status as any
      });
      
      toast({
        title: "Transaction updated",
        description: "Transaction has been updated successfully.",
      });
      
      resetForm();
      setIsEditOpen(false);
      setEditingTransaction(null);
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update transaction.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      await deleteTransaction(transactionId);
      
      toast({
        title: "Transaction deleted",
        description: "Transaction has been deleted successfully.",
      });
      
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction.",
        variant: "destructive",
      });
    }
  };

  const TransactionForm = ({ onSubmit, submitText }: { onSubmit: (e: React.FormEvent) => void; submitText: string }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="round-up">Round-up</SelectItem>
              <SelectItem value="withdrawal">Withdrawal</SelectItem>
              <SelectItem value="reward">Reward</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₹)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="100.00"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Transaction description..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-educhain-purple to-educhain-darkPurple"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : submitText}
      </Button>
    </form>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transaction Management</CardTitle>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-to-r from-educhain-purple to-educhain-darkPurple">
              <Plus className="h-4 w-4 mr-1" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm onSubmit={handleCreate} submitText="Create Transaction" />
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{transaction.type.replace('-', ' ')}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    transaction.status === 'success' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{transaction.description}</p>
                <p className="text-sm font-medium">₹{transaction.amount.toFixed(2)}</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(transaction)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(transaction.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {transactions.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No transactions yet</p>
          )}
        </div>
      </CardContent>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <TransactionForm onSubmit={handleUpdate} submitText="Update Transaction" />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TransactionManager;
