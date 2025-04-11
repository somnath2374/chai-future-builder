
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, ArrowUp, ArrowDown } from "lucide-react";
import { getEduScore } from '@/lib/education';

const EduScoreCard = () => {
  const [score, setScore] = useState({
    score: 0,
    change: 0,
    lastUpdated: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        setLoading(true);
        const data = await getEduScore();
        setScore(data);
      } catch (error) {
        console.error('Error fetching EduScore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, []);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-purple-50 to-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-educhain-purple" />
            EduScore
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
          <Trophy className="h-5 w-5 text-educhain-purple" />
          EduScore
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{score.score}</div>
        {score.change !== 0 && (
          <div className={`text-sm mt-1 flex items-center ${score.change > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {score.change > 0 ? (
              <>
                <ArrowUp className="h-4 w-4 mr-1" />
                +{score.change} points this week
              </>
            ) : (
              <>
                <ArrowDown className="h-4 w-4 mr-1" />
                {score.change} points this week
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EduScoreCard;
