import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";
import { getLearningProgress } from '@/lib/education';

const LearningProgress = () => {
  const [progress, setProgress] = useState({
    completedLessons: 0,
    totalLessons: 0,
    availableRewards: 0,
    lastCompleted: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const data = await getLearningProgress();
        setProgress(data);
      } catch (error) {
        console.error('Error fetching learning progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const percentComplete = progress.totalLessons > 0 
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100) 
    : 0;

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-educhain-purple" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-md mb-2"></div>
          <div className="h-4 w-40 bg-gray-200 animate-pulse rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-educhain-purple" />
          Learning Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {progress.completedLessons} / {progress.totalLessons} Lessons
        </div>
        <Progress 
          value={percentComplete} 
          className="h-2 mt-2 mb-2" 
        />
        <div className="text-sm text-muted-foreground mt-1">
          {progress.availableRewards > 0 
            ? `${progress.availableRewards} rewards available` 
            : 'Complete more lessons to earn rewards'}
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningProgress;
