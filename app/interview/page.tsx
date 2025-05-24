'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PerformanceMetrics from '../components/PerformanceMetrics';
import FacialAnalysis from '../components/FacialAnalysis';
import SpeechAnalysis from '../components/SpeechAnalysis';
import ResultsSummary from '../components/ResultsSummary';

// Interview stages
enum InterviewStage {
  SETUP = 'setup',
  INTRO = 'intro',
  INTERVIEW = 'interview',
  RESULTS = 'results',
}

// Mock questions for the interview
const INTERVIEW_QUESTIONS = [
  "Tell me about yourself and your background.",
  "What are your greatest strengths and weaknesses?",
  "Why are you interested in this position?",
  "Describe a challenge you faced and how you overcame it.",
  "Where do you see yourself in five years?",
  "How do you handle stress and pressure?",
  "What questions do you have for me?",
];

export default function InterviewPage() {
  const [stage, setStage] = useState<InterviewStage>(InterviewStage.SETUP);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [performanceData, setPerformanceData] = useState({
    eyeContact: 0,
    facialExpressions: 0,
    speechClarity: 0,
    confidence: 0,
    contentRelevance: 0,
    bodyLanguage: 0,
    emotionalIntelligence: 0,
    overallScore: 0,
  });
  
  const [countdown, setCountdown] = useState(5);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [microphonePermission, setMicrophonePermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const webcamRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Request camera and microphone permissions
  const requestMediaPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Store the stream for later use
      streamRef.current = stream;
      
      // If we have a webcam element, set it as the source
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
      
      setCameraPermission(true);
      setMicrophonePermission(true);
      setErrorMessage(null);
      
      return true;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      
      // Check if specific permissions were denied
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          setErrorMessage('Camera and/or microphone permission denied. Please allow access and try again.');
        } else if (error.name === 'NotFoundError') {
          setErrorMessage('No camera or microphone found. Please connect the required devices and try again.');
        } else {
          setErrorMessage(`Error accessing media devices: ${error.message}`);
        }
      } else {
        setErrorMessage('An unexpected error occurred when trying to access the camera and microphone.');
      }
      
      setCameraPermission(false);
      setMicrophonePermission(false);
      
      return false;
    }
  }, []);
  
  // Start the interview process
  const startInterview = async () => {
    const permissionsGranted = await requestMediaPermissions();
    
    if (!permissionsGranted) {
      return;
    }
    
    setStage(InterviewStage.INTRO);
    
    // Countdown timer for interview start
    let count = 5;
    setCountdown(count);
    
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      
      if (count <= 0) {
        clearInterval(countdownInterval);
        setStage(InterviewStage.INTERVIEW);
        setIsRecording(true);
      }
    }, 1000);
  };
  
  // Move to the next question or finish interview
  const nextQuestion = () => {
    if (currentQuestionIndex < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      
      // Update content relevance based on progression (simulated improvement)
      setPerformanceData(prev => ({
        ...prev,
        contentRelevance: Math.min(prev.contentRelevance + 0.1, 1)
      }));
    } else {
      // End interview and show results
      setIsRecording(false);
      setStage(InterviewStage.RESULTS);
      generateFinalReport();
      
      // Stop media streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  // Handle updates from facial analysis component
  const handleFacialDataUpdate = useCallback((data: { eyeContact: number; facialExpressions: number }) => {
    setPerformanceData(prev => ({
      ...prev,
      eyeContact: data.eyeContact,
      facialExpressions: data.facialExpressions,
      // Body language is partially derived from facial expressions
      bodyLanguage: (prev.bodyLanguage * 0.7) + (data.facialExpressions * 0.3)
    }));
  }, []);
  
  // Handle updates from speech analysis component
  const handleSpeechDataUpdate = useCallback((data: { clarity: number; confidence: number }) => {
    setPerformanceData(prev => ({
      ...prev,
      speechClarity: data.clarity,
      confidence: data.confidence,
      // Emotional intelligence is derived from a combination of speech and facial data
      emotionalIntelligence: (prev.emotionalIntelligence * 0.6) + 
                             (data.confidence * 0.2) + 
                             (prev.facialExpressions * 0.2)
    }));
  }, []);
  
  // Initialize content relevance with a baseline score
  useEffect(() => {
    if (stage === InterviewStage.INTERVIEW && performanceData.contentRelevance === 0) {
      setPerformanceData(prev => ({
        ...prev,
        contentRelevance: 0.5 // Start with a neutral score
      }));
    }
  }, [stage, performanceData.contentRelevance]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Stop all media streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  // Generate final performance report
  const generateFinalReport = () => {
    // Calculate overall score
    const metrics = Object.entries(performanceData).filter(([key]) => key !== 'overallScore');
    const overallScore = metrics.reduce((sum, [_, value]) => sum + value, 0) / metrics.length;
    
    setPerformanceData(prev => ({
      ...prev,
      overallScore,
    }));
  };
  
  const renderStageContent = () => {
    switch (stage) {
      case InterviewStage.SETUP:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Prepare for Your Interview</h2>
            <p className="mb-8">
              We'll need access to your camera and microphone to analyze your performance.
              Find a quiet place with good lighting and ensure your face is clearly visible.
            </p>
            
            {errorMessage && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
                {errorMessage}
              </div>
            )}
            
            <button 
              onClick={startInterview}
              className="button-primary text-lg px-8 py-3"
              disabled={cameraPermission === false || microphonePermission === false}
            >
              I'm Ready
            </button>
            
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>This will use your camera and microphone for real-time analysis.</p>
              <p>Your data will not be stored or shared.</p>
            </div>
          </div>
        );
        
      case InterviewStage.INTRO:
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Starting Interview In...</h2>
            <div className="text-6xl font-bold mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, repeat: countdown > 0 ? 1 : 0, repeatType: "reverse" }}
              >
                {countdown}
              </motion.div>
            </div>
            <p>Prepare yourself. The first question will appear shortly.</p>
          </div>
        );
        
      case InterviewStage.INTERVIEW:
        return (
          <div>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">Question {currentQuestionIndex + 1}/{INTERVIEW_QUESTIONS.length}</h3>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-lg">{INTERVIEW_QUESTIONS[currentQuestionIndex]}</p>
              </div>
            </div>
            
            <div className="flex justify-between gap-4">
              <button 
                className="button-secondary"
                onClick={nextQuestion}
              >
                {currentQuestionIndex < INTERVIEW_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Interview'}
              </button>
            </div>
            
            <div className="mt-8">
              <PerformanceMetrics data={performanceData} />
            </div>
          </div>
        );
        
      case InterviewStage.RESULTS:
        return (
          <ResultsSummary 
            performanceData={performanceData}
            totalQuestions={INTERVIEW_QUESTIONS.length}
          />
        );
    }
  };
  
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:text-primary-dark font-medium">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold mt-4">PerformaAI Interview Session</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Webcam Feed and Analysis */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
                {(stage === InterviewStage.INTERVIEW || stage === InterviewStage.INTRO) && (
                  <video
                    ref={webcamRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )}
                
                {stage === InterviewStage.SETUP && (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <p>Camera feed will appear here</p>
                  </div>
                )}
                
                {stage === InterviewStage.RESULTS && (
                  <div className="w-full h-full flex items-center justify-center bg-primary">
                    <p className="text-xl text-white font-bold">Interview Complete!</p>
                  </div>
                )}
              </div>
              
              {isRecording && (
                <div className="flex items-center text-accent font-medium">
                  <div className="w-3 h-3 bg-accent rounded-full mr-2 animate-pulse"></div>
                  Recording
                </div>
              )}
            </div>
            
            {stage === InterviewStage.INTERVIEW && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-bold mb-4">Facial Analysis</h3>
                  <FacialAnalysis 
                    eyeContact={performanceData.eyeContact} 
                    facialExpressions={performanceData.facialExpressions}
                    webcamRef={webcamRef}
                    onFacialDataUpdate={handleFacialDataUpdate}
                  />
                </div>
                <div className="card">
                  <h3 className="text-lg font-bold mb-4">Speech Analysis</h3>
                  <SpeechAnalysis 
                    clarity={performanceData.speechClarity}
                    confidence={performanceData.confidence}
                    isRecording={isRecording}
                    onSpeechDataUpdate={handleSpeechDataUpdate}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Interview Controls and Feedback */}
          <div className="card h-fit">
            {renderStageContent()}
          </div>
        </div>
      </div>
    </div>
  );
} 