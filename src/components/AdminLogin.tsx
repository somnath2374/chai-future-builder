
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Lock, Shield } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdmin';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { adminLogin, adminLogout, isAdminAuthenticated } = useAdmin();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminLogin(username, password)) {
      toast({
        title: "Admin login successful",
        description: "You now have access to transaction management.",
      });
      setIsOpen(false);
      setUsername('');
      setPassword('');
    } else {
      toast({
        title: "Login failed",
        description: "Invalid admin credentials.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    adminLogout();
    toast({
      title: "Admin logout",
      description: "You have been logged out from admin panel.",
    });
  };

  if (isAdminAuthenticated) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleLogout}
        className="text-red-600 hover:text-red-700"
      >
        <Shield className="h-4 w-4 mr-1" />
        Admin Logout
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-600">
          <Lock className="h-4 w-4 mr-1" />
          Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-educhain-purple to-educhain-darkPurple"
          >
            <Lock className="mr-2 h-4 w-4" />
            Login as Admin
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLogin;
