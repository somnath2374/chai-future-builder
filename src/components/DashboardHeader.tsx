
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, BookOpen } from "lucide-react";
import AdminLogin from '@/components/AdminLogin';

interface DashboardHeaderProps {
  userName: string | null;
  onSignOut: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName, onSignOut }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-educhain-darkPurple">
            Edu<span className="text-educhain-purple">Chain</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/lessons')}
            className="text-educhain-purple"
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Learn
          </Button>
          <AdminLogin />
          <div className="hidden md:block">
            <span className="font-medium">Welcome, {userName || 'User'}</span>
          </div>
          <Button variant="outline" size="sm" className="gap-1" onClick={onSignOut}>
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
