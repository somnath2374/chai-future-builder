
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowUpRight, PiggyBank, BookOpen, Trophy, LogOut } from "lucide-react";

const Dashboard = () => {
  // This data would normally come from an API/backend
  const mockData = {
    userName: "Rajat Sharma",
    totalSavings: "₹1,245.80",
    eduScore: 720,
    weeklyChange: "+15",
    completedLessons: 8,
    availableRewards: 3
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-educhain-darkPurple">
              Edu<span className="text-educhain-purple">Chain</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <span className="font-medium">Welcome, {mockData.userName}</span>
            </div>
            <Button variant="outline" size="sm" className="gap-1">
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <h2 className="text-2xl font-bold mb-6">Your Financial Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-educhain-purple" />
                Total Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockData.totalSavings}</div>
              <div className="text-sm text-muted-foreground mt-1">
                From spare change investments
              </div>
              <Button variant="ghost" size="sm" className="mt-4 text-educhain-purple hover:text-educhain-darkPurple">
                View Transactions
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-educhain-purple" />
                EduScore
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockData.eduScore}</div>
              <div className="text-sm text-green-600 mt-1">
                {mockData.weeklyChange} points this week 📈
              </div>
              <Button variant="ghost" size="sm" className="mt-4 text-educhain-purple hover:text-educhain-darkPurple">
                View Score Details
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-educhain-purple" />
                Learning Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockData.completedLessons} Lessons</div>
              <div className="text-sm text-muted-foreground mt-1">
                {mockData.availableRewards} rewards available
              </div>
              <Button variant="ghost" size="sm" className="mt-4 text-educhain-purple hover:text-educhain-darkPurple">
                Continue Learning
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border mb-8">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-auto py-6 flex flex-col items-center bg-educhain-lightPurple text-educhain-darkPurple hover:bg-educhain-purple hover:text-white">
              <PiggyBank className="h-6 w-6 mb-2" />
              <span>Add Funds</span>
            </Button>
            <Button className="h-auto py-6 flex flex-col items-center bg-educhain-lightPurple text-educhain-darkPurple hover:bg-educhain-purple hover:text-white">
              <svg className="h-6 w-6 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Connect UPI</span>
            </Button>
            <Button className="h-auto py-6 flex flex-col items-center bg-educhain-lightPurple text-educhain-darkPurple hover:bg-educhain-purple hover:text-white">
              <BookOpen className="h-6 w-6 mb-2" />
              <span>Take a Quiz</span>
            </Button>
            <Button className="h-auto py-6 flex flex-col items-center bg-educhain-lightPurple text-educhain-darkPurple hover:bg-educhain-purple hover:text-white">
              <Trophy className="h-6 w-6 mb-2" />
              <span>View Rewards</span>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border">
          <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
          <div className="divide-y">
            {[1, 2, 3].map((item) => (
              <div key={item} className="py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-educhain-lightPurple p-2 rounded-full">
                    <PiggyBank className="h-5 w-5 text-educhain-purple" />
                  </div>
                  <div>
                    <div className="font-medium">Coffee Round-Up</div>
                    <div className="text-sm text-muted-foreground">Today, 9:41 AM</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">+ ₹3.50</div>
                  <div className="text-sm text-green-600">Invested</div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">View All Transactions</Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
