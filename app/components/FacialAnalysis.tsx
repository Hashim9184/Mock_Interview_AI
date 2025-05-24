'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

interface FacialAnalysisProps {
  eyeContact: number;
  facialExpressions: number;
  webcamRef: React.RefObject<HTMLVideoElement>;
  onFacialDataUpdate: (data: {
    eyeContact: number;
    facialExpressions: number;
  }) => void;
}

const FacialAnalysis: React.FC<FacialAnalysisProps> = ({ 
  eyeContact, 
  facialExpressions, 
  webcamRef,
  onFacialDataUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [expressionData, setExpressionData] = useState<Record<string, number>>({});
  const [eyeContactScore, setEyeContactScore] = useState(0);
  
  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      // Use CDN version of models instead of local ones
      const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
      
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        
        setModelsLoaded(true);
        console.log("Face-api models loaded successfully");
      } catch (error) {
        console.error("Error loading face-api models:", error);
      }
    };

    loadModels();
  }, []);

  // Run face detection when models are loaded
  useEffect(() => {
    if (!modelsLoaded || !webcamRef.current || !canvasRef.current) return;

    const video = webcamRef.current;
    const canvas = canvasRef.current;
    
    let animationId: number;
    
    if (video.readyState === 4) {
      startFaceDetection();
    } else {
      video.addEventListener('loadeddata', startFaceDetection);
    }
    
    function startFaceDetection() {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const detectFace = async () => {
        if (!video || !canvas) return;
        
        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
        
        try {
          const detections = await faceapi.detectAllFaces(video, options)
            .withFaceLandmarks()
            .withFaceExpressions();
          
          // Clear previous drawings
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
          
          if (detections.length > 0) {
            setFaceDetected(true);
            
            // Get first face (assuming single person interview)
            const face = detections[0];
            
            // Draw face landmarks and expression on canvas
            faceapi.draw.drawDetections(canvas, detections);
            faceapi.draw.drawFaceLandmarks(canvas, detections);
            
            // Analyze expressions
            const expressions = face.expressions;
            setExpressionData(expressions as unknown as Record<string, number>);
            
            // Calculate expressions score (positive emotions: happy, surprised vs negative: angry, disgusted, fearful, sad)
            const expressionScore = calculateExpressionScore(expressions as unknown as Record<string, number>);
            
            // Calculate eye contact score based on face orientation
            const eyeScore = calculateEyeContactScore(face.landmarks.positions);
            setEyeContactScore(eyeScore);
            
            // Update parent component with real data
            onFacialDataUpdate({
              eyeContact: eyeScore,
              facialExpressions: expressionScore
            });
          } else {
            setFaceDetected(false);
          }
          
          // Continue detection loop
          animationId = requestAnimationFrame(detectFace);
        } catch (error) {
          console.error("Error during face detection:", error);
          animationId = requestAnimationFrame(detectFace);
        }
      };
      
      detectFace();
    }
    
    return () => {
      video.removeEventListener('loadeddata', startFaceDetection);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [modelsLoaded, webcamRef, onFacialDataUpdate]);
  
  // Calculate expression score from face-api.js expressions
  const calculateExpressionScore = (expressions: Record<string, number>): number => {
    if (!expressions) return 0;
    
    // Positive expressions boost score
    const positive = (expressions.happy || 0) + (expressions.surprised || 0) * 0.5;
    
    // Negative expressions reduce score
    const negative = 
      (expressions.angry || 0) + 
      (expressions.disgusted || 0) + 
      (expressions.fearful || 0) + 
      (expressions.sad || 0);
    
    // Neutral is baseline
    const neutral = expressions.neutral || 0;
    
    // Calculate score (0-1)
    let score = 0.5 + (positive * 0.5) - (negative * 0.3) + (neutral * 0.1);
    
    // Clamp between 0-1
    return Math.max(0, Math.min(1, score));
  };
  
  // Calculate eye contact score based on face landmarks
  const calculateEyeContactScore = (landmarks: faceapi.Point[]): number => {
    if (!landmarks || landmarks.length < 68) return 0;
    
    // Check if face is looking at camera by analyzing key landmarks
    // Simplified version - in real app would use more sophisticated 3D pose estimation
    
    // Get nose tip (point 30) and eye centers (average of points 37-42 for left eye, 43-48 for right eye)
    const noseTip = landmarks[30];
    
    const leftEyePoints = landmarks.slice(37, 42);
    const rightEyePoints = landmarks.slice(43, 48);
    
    const leftEyeCenter = {
      x: leftEyePoints.reduce((sum, pt) => sum + pt.x, 0) / leftEyePoints.length,
      y: leftEyePoints.reduce((sum, pt) => sum + pt.y, 0) / leftEyePoints.length
    };
    
    const rightEyeCenter = {
      x: rightEyePoints.reduce((sum, pt) => sum + pt.x, 0) / rightEyePoints.length,
      y: rightEyePoints.reduce((sum, pt) => sum + pt.y, 0) / rightEyePoints.length
    };
    
    // Calculate eye level
    const eyeLevel = (leftEyeCenter.y + rightEyeCenter.y) / 2;
    
    // Check horizontal symmetry (indicates looking straight ahead)
    const eyeSymmetry = Math.abs(leftEyeCenter.x - noseTip.x) / Math.abs(rightEyeCenter.x - noseTip.x);
    
    // Score based on how close to 1.0 the symmetry is (1.0 means perfectly symmetric)
    const symmetryScore = 1 - Math.min(0.5, Math.abs(eyeSymmetry - 1)) * 2;
    
    // Check vertical positioning
    const verticalScore = 1 - Math.min(0.5, Math.abs(noseTip.y - eyeLevel) / 50) * 2;
    
    // Calculate final score (80% symmetry, 20% vertical)
    const finalScore = symmetryScore * 0.8 + verticalScore * 0.2;
    
    return Math.max(0, Math.min(1, finalScore));
  };

  const getFeedback = (metric: string, value: number) => {
    if (metric === 'eyeContact') {
      if (value < 0.3) return 'Try to maintain more eye contact with the camera';
      if (value < 0.7) return 'Good eye contact, but could be more consistent';
      return 'Excellent eye contact throughout';
    } else if (metric === 'facialExpressions') {
      if (value < 0.3) return 'Try to show more expression and engagement';
      if (value < 0.7) return 'Your expressions are appropriate but could be more dynamic';
      return 'Great facial engagement and expressiveness';
    }
    return '';
  };

  const getColorClass = (value: number) => {
    if (value < 0.3) return 'text-red-500';
    if (value < 0.7) return 'text-yellow-500';
    return 'text-green-500';
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100)}%`;
  };
  
  // Get dominant expression
  const getDominantExpression = (): string => {
    if (!expressionData || Object.keys(expressionData).length === 0) return 'neutral';
    
    return Object.entries(expressionData)
      .sort((a, b) => b[1] - a[1])
      .map(([key]) => key)[0];
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-1">
          <span>Eye Contact</span>
          <span className={`font-medium ${getColorClass(eyeContact)}`}>
            {formatPercentage(eyeContact)}
          </span>
        </div>
        <div className="performance-meter">
          <div 
            className={`performance-meter-fill ${eyeContact < 0.3 ? 'bg-red-500' : eyeContact < 0.7 ? 'bg-yellow-500' : 'bg-green-500'}`} 
            style={{ width: `${eyeContact * 100}%` }}
          ></div>
        </div>
        <p className="text-sm mt-1 italic">{getFeedback('eyeContact', eyeContact)}</p>
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <span>Facial Expressions</span>
          <span className={`font-medium ${getColorClass(facialExpressions)}`}>
            {formatPercentage(facialExpressions)}
          </span>
        </div>
        <div className="performance-meter">
          <div 
            className={`performance-meter-fill ${facialExpressions < 0.3 ? 'bg-red-500' : facialExpressions < 0.7 ? 'bg-yellow-500' : 'bg-green-500'}`} 
            style={{ width: `${facialExpressions * 100}%` }}
          ></div>
        </div>
        <p className="text-sm mt-1 italic">{getFeedback('facialExpressions', facialExpressions)}</p>
      </div>

      {/* Face detection visualization */}
      <div className="mt-4 relative bg-gray-800 rounded-lg overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="absolute top-0 left-0 w-full h-full z-10"
        />
        {!faceDetected && modelsLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-white z-20">
            <p>No face detected. Please make sure your face is visible.</p>
          </div>
        )}
        {!modelsLoaded && (
          <div className="absolute inset-0 flex items-center justify-center text-white z-20">
            <p>Loading facial analysis models...</p>
          </div>
        )}
        
        {/* Display dominant expression when face is detected */}
        {faceDetected && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm z-20">
            Dominant expression: {getDominantExpression()}
          </div>
        )}
      </div>
    </div>
  );
};

export default FacialAnalysis; 