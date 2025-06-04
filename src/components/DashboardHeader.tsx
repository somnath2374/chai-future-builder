
import React from 'react';
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  user: any;
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onSignOut }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-educhain-darkPurple">
            Edu<span className="text-educhain-purple">Chain</span>
          </h1>
          <p className="text-sm text-gray-600">Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</span>
          </div>
          <Button 
            onClick={onSignOut}
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
