'use client';

import React from 'react';
import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:text-primary-dark font-medium">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold mt-4">PerformaAI Demo</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Watch a sample interview session to see how PerformaAI analyzes performance.
          </p>
        </div>
        
        <div className="card mb-8">
          <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
            <p className="text-white">Demo video would play here</p>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            This demo shows a mock interview with real-time analysis of facial expressions, 
            speech patterns, and content relevance. The AI provides instant feedback and generates
            a comprehensive performance report at the end.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Key Features Demonstrated</h2>
            <ul className="space-y-2 pl-5 list-disc text-gray-600 dark:text-gray-300">
              <li>Real-time facial expression tracking</li>
              <li>Speech clarity and confidence analysis</li>
              <li>Content relevance scoring</li>
              <li>Body language interpretation</li>
              <li>Emotional intelligence assessment</li>
              <li>Comprehensive performance metrics</li>
            </ul>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Ready to Try It Yourself?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Experience the full power of PerformaAI by starting your own interview session. 
              You'll receive personalized feedback and detailed performance metrics.
            </p>
            <Link href="/interview" className="button-primary block text-center">
              Start Your Interview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 