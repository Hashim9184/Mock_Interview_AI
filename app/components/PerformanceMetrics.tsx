'use client';

import React from 'react';

interface PerformanceMetricsProps {
  data: {
    eyeContact: number;
    facialExpressions: number;
    speechClarity: number;
    confidence: number;
    contentRelevance: number;
    bodyLanguage: number;
    emotionalIntelligence: number;
    overallScore: number;
  };
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ data }) => {
  const getColorClass = (value: number) => {
    if (value < 0.3) return 'bg-red-500';
    if (value < 0.7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };

  const metrics = [
    { label: 'Eye Contact', value: data.eyeContact },
    { label: 'Facial Expressions', value: data.facialExpressions },
    { label: 'Speech Clarity', value: data.speechClarity },
    { label: 'Confidence', value: data.confidence },
    { label: 'Content Relevance', value: data.contentRelevance },
    { label: 'Body Language', value: data.bodyLanguage },
    { label: 'Emotional Intelligence', value: data.emotionalIntelligence },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold mb-2">Real-Time Performance Metrics</h3>
      
      {metrics.map((metric, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{metric.label}</span>
            <span className="font-medium">{formatPercentage(metric.value)}</span>
          </div>
          <div className="performance-meter">
            <div 
              className={`performance-meter-fill ${getColorClass(metric.value)}`} 
              style={{ width: `${metric.value * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PerformanceMetrics; 