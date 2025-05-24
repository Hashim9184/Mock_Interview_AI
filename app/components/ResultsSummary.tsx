'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ResultsSummaryProps {
  performanceData: {
    eyeContact: number;
    facialExpressions: number;
    speechClarity: number;
    confidence: number;
    contentRelevance: number;
    bodyLanguage: number;
    emotionalIntelligence: number;
    overallScore: number;
  };
  totalQuestions: number;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({ performanceData, totalQuestions }) => {
  const getGrade = (score: number) => {
    if (score >= 0.9) return 'A+';
    if (score >= 0.8) return 'A';
    if (score >= 0.7) return 'B+';
    if (score >= 0.6) return 'B';
    if (score >= 0.5) return 'C+';
    if (score >= 0.4) return 'C';
    return 'D';
  };

  const getColorClass = (value: number) => {
    if (value < 0.4) return 'text-red-500';
    if (value < 0.7) return 'text-yellow-500';
    return 'text-green-500';
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };

  const getImprovementTips = () => {
    const tips = [];
    
    if (performanceData.eyeContact < 0.6) {
      tips.push('Work on maintaining consistent eye contact with the camera');
    }
    
    if (performanceData.facialExpressions < 0.6) {
      tips.push('Try to show more engagement through your facial expressions');
    }
    
    if (performanceData.speechClarity < 0.6) {
      tips.push('Focus on speaking more clearly and at a moderate pace');
    }
    
    if (performanceData.confidence < 0.6) {
      tips.push('Work on projecting more confidence in your delivery');
    }
    
    if (performanceData.contentRelevance < 0.6) {
      tips.push('Practice providing more focused and relevant answers to questions');
    }
    
    if (performanceData.bodyLanguage < 0.6) {
      tips.push('Be mindful of your posture and avoid excessive movements');
    }
    
    if (performanceData.emotionalIntelligence < 0.6) {
      tips.push('Practice showing more emotional intelligence and adaptability');
    }
    
    return tips.length > 0 ? tips : ['Keep practicing to maintain your excellent performance'];
  };

  const metrics = [
    { label: 'Eye Contact', value: performanceData.eyeContact },
    { label: 'Facial Expressions', value: performanceData.facialExpressions },
    { label: 'Speech Clarity', value: performanceData.speechClarity },
    { label: 'Confidence', value: performanceData.confidence },
    { label: 'Content Relevance', value: performanceData.contentRelevance },
    { label: 'Body Language', value: performanceData.bodyLanguage },
    { label: 'Emotional Intelligence', value: performanceData.emotionalIntelligence },
  ];

  const improvementTips = getImprovementTips();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Interview Performance Summary</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          You've completed all {totalQuestions} interview questions. Here's how you did:
        </p>
        
        <motion.div 
          className="text-6xl font-bold"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className={getColorClass(performanceData.overallScore)}>
            {getGrade(performanceData.overallScore)}
          </span>
          <span className="text-2xl ml-2 font-normal text-gray-500">
            ({formatPercentage(performanceData.overallScore)})
          </span>
        </motion.div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Performance Breakdown</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <motion.div 
              key={index}
              className="space-y-1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex justify-between text-sm">
                <span>{metric.label}</span>
                <span className={`font-medium ${getColorClass(metric.value)}`}>
                  {formatPercentage(metric.value)} ({getGrade(metric.value)})
                </span>
              </div>
              <div className="performance-meter">
                <div 
                  className={`performance-meter-fill ${metric.value < 0.4 ? 'bg-red-500' : metric.value < 0.7 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                  style={{ width: `${metric.value * 100}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Areas for Improvement</h3>
        
        <motion.ul 
          className="space-y-2 pl-5 list-disc"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {improvementTips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </motion.ul>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/interview" className="button-primary text-center">
          Start New Interview
        </Link>
        <Link href="/" className="button-secondary text-center">
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default ResultsSummary; 