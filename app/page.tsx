'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    { icon: '👁️', title: 'Facial Analysis', description: 'Evaluates eye contact and face orientation' },
    { icon: '🗣️', title: 'Speech Analysis', description: 'Measures clarity, confidence, and coherence' },
    { icon: '💡', title: 'Content Evaluation', description: 'Assesses depth and relevance of answers' },
    { icon: '🧍', title: 'Posture Detection', description: 'Analyzes body language and gestural cues' },
    { icon: '🎭', title: 'Emotional Intelligence', description: 'Gauges emotional response and stress levels' },
    { icon: '📈', title: 'Performance Scoring', description: 'Provides detailed metrics with improvement tips' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-dark opacity-90 z-0"></div>
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] bg-repeat bg-center mix-blend-overlay z-0"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            The Real-Time AI Mock Interviewer & Performance Analyzer
          </motion.h1>
          
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Perfect your interview skills with advanced AI analysis of your facial expressions, speech patterns, and content relevance.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/interview" className="button-primary text-lg px-8 py-3">
              Start Interview
            </Link>
            <Link href="/demo" className="button-secondary text-lg px-8 py-3">
              Watch Demo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-light dark:bg-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Performance Analysis</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              PerformaAI goes beyond basic interview simulations with comprehensive real-time analysis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`card hover:shadow-lg ${hoveredFeature === index ? 'border-primary' : ''}`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Ace Your Next Interview?</h2>
          <p className="text-lg mb-10 max-w-3xl mx-auto">
            Start using PerformaAI today and transform your interview preparation with real-time feedback and personalized improvement suggestions.
          </p>
          <Link href="/interview" className="bg-white text-primary hover:bg-gray-100 font-bold text-lg px-8 py-3 rounded shadow-md transition-all duration-300">
            Start Your First Interview
          </Link>
        </div>
      </section>
    </div>
  );
} 