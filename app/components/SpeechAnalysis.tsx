'use client';

import React, { useEffect, useState } from 'react';

interface SpeechAnalysisProps {
  clarity: number;
  confidence: number;
  isRecording: boolean;
  onSpeechDataUpdate: (data: {
    clarity: number;
    confidence: number;
  }) => void;
}

// Define Speech Recognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

// Custom type for Speech Recognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onstart: ((event: Event) => void) | null;
}

// Declare global window interface
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const SpeechAnalysis: React.FC<SpeechAnalysisProps> = ({ 
  clarity, 
  confidence,
  isRecording,
  onSpeechDataUpdate
}) => {
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [fillerWordCount, setFillerWordCount] = useState(0);
  const [speechRate, setSpeechRate] = useState<string>('Normal');
  const [vocalVariety, setVocalVariety] = useState<string>('Moderate');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  // Set up speech recognition
  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser");
      return;
    }
    
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    recognitionInstance.maxAlternatives = 1;
    
    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const { resultIndex, results } = event;
      
      // Get transcript from current result
      const transcriptResult = results[resultIndex];
      const transcript = transcriptResult[0].transcript;
      
      // Calculate confidence score
      const rawConfidence = transcriptResult[0].confidence; // 0-1 value
      
      if (transcriptResult.isFinal) {
        // Add to completed transcripts
        setTranscripts(prev => [...prev, transcript]);
        setCurrentTranscript('');
        
        // Analyze speech patterns
        analyzeTranscript(transcript, rawConfidence);
      } else {
        setCurrentTranscript(transcript);
      }
    };
    
    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error", event);
      setIsListening(false);
    };
    
    recognitionInstance.onend = () => {
      setIsListening(false);
      
      // Restart if recording is still enabled
      if (isRecording) {
        recognitionInstance.start();
        setIsListening(true);
      }
    };
    
    setRecognition(recognitionInstance);
    
    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, []);
  
  // Start/stop recognition based on isRecording prop
  useEffect(() => {
    if (!recognition) return;
    
    if (isRecording && !isListening) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        if (e instanceof DOMException && e.message.includes("already started")) {
          // Optionally log or ignore this error
        } else {
          throw e;
        }
      }
    } else if (!isRecording && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [isRecording, isListening, recognition]);
  
  // Analyze transcript for speech metrics
  const analyzeTranscript = (transcript: string, rawConfidence: number) => {
    // Count filler words
    const fillerWords = ['um', 'uh', 'like', 'you know', 'sort of', 'kind of', 'basically', 'actually'];
    let fillerCount = 0;
    
    const lowerTranscript = transcript.toLowerCase();
    fillerWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerTranscript.match(regex);
      if (matches) {
        fillerCount += matches.length;
      }
    });
    
    setFillerWordCount(prev => prev + fillerCount);
    
    // Calculate speech rate (words per minute)
    const wordCount = transcript.split(/\s+/).length;
    const averageWordsPerMinute = 150; // Average speech rate
    
    // Assuming the transcript covers about 5 seconds
    const estimatedWordsPerMinute = wordCount * 12; // 60 seconds / 5 seconds = 12
    
    let rateStatus = 'Normal';
    if (estimatedWordsPerMinute > averageWordsPerMinute * 1.3) {
      rateStatus = 'Too Fast';
    } else if (estimatedWordsPerMinute > averageWordsPerMinute * 1.1) {
      rateStatus = 'Slightly Fast';
    } else if (estimatedWordsPerMinute < averageWordsPerMinute * 0.7) {
      rateStatus = 'Too Slow';
    } else if (estimatedWordsPerMinute < averageWordsPerMinute * 0.9) {
      rateStatus = 'Slightly Slow';
    }
    
    setSpeechRate(rateStatus);
    
    // Vocal variety is harder to detect with just text - this would ideally use audio analysis
    // Here we use confidence as proxy (higher confidence often means clearer speech)
    let varietyStatus = 'Moderate';
    if (rawConfidence > 0.8) {
      varietyStatus = 'Good';
    } else if (rawConfidence < 0.5) {
      varietyStatus = 'Limited';
    }
    
    setVocalVariety(varietyStatus);
    
    // Calculate clarity and confidence scores for parent component
    // Clarity is affected by speech rate and confidence
    const clarityScore = calculateClarityScore(rateStatus, rawConfidence);
    
    // Confidence score is affected by filler words and raw confidence
    const confidenceScore = calculateConfidenceScore(fillerCount, rawConfidence, wordCount);
    
    // Update parent component
    onSpeechDataUpdate({
      clarity: clarityScore,
      confidence: confidenceScore
    });
  };
  
  // Calculate clarity score
  const calculateClarityScore = (rate: string, rawConfidence: number): number => {
    let rateScore = 0.7; // Default for "Normal"
    
    switch (rate) {
      case 'Too Fast':
        rateScore = 0.3;
        break;
      case 'Slightly Fast':
        rateScore = 0.5;
        break;
      case 'Slightly Slow':
        rateScore = 0.6;
        break;
      case 'Too Slow':
        rateScore = 0.4;
        break;
    }
    
    // Combine rate and raw confidence
    return (rateScore * 0.7) + (rawConfidence * 0.3);
  };
  
  // Calculate confidence score
  const calculateConfidenceScore = (fillerCount: number, rawConfidence: number, wordCount: number): number => {
    // Calculate filler word ratio
    const fillerRatio = wordCount > 0 ? fillerCount / wordCount : 0;
    const fillerScore = Math.max(0, 1 - (fillerRatio * 10)); // Penalize heavily for filler words
    
    // Combine filler score and raw confidence
    return (fillerScore * 0.6) + (rawConfidence * 0.4);
  };

  const getFeedback = (metric: string, value: number) => {
    if (metric === 'clarity') {
      if (value < 0.3) return 'Try to speak more clearly and at a moderate pace';
      if (value < 0.7) return 'Your speech is relatively clear but could improve';
      return 'Excellent speech clarity and articulation';
    } else if (metric === 'confidence') {
      if (value < 0.3) return 'Work on speaking more confidently and reducing filler words';
      if (value < 0.7) return 'Your confidence is growing but could be stronger';
      return 'You sound very confident and assured';
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

  // Speech patterns from real analysis
  const speechPatterns = [
    { name: 'Filler Words', count: fillerWordCount },
    { name: 'Speaking Rate', status: speechRate },
    { name: 'Vocal Variety', status: vocalVariety }
  ];

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-1">
          <span>Clarity</span>
          <span className={`font-medium ${getColorClass(clarity)}`}>
            {formatPercentage(clarity)}
          </span>
        </div>
        <div className="performance-meter">
          <div 
            className={`performance-meter-fill ${clarity < 0.3 ? 'bg-red-500' : clarity < 0.7 ? 'bg-yellow-500' : 'bg-green-500'}`} 
            style={{ width: `${clarity * 100}%` }}
          ></div>
        </div>
        <p className="text-sm mt-1 italic">{getFeedback('clarity', clarity)}</p>
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <span>Confidence</span>
          <span className={`font-medium ${getColorClass(confidence)}`}>
            {formatPercentage(confidence)}
          </span>
        </div>
        <div className="performance-meter">
          <div 
            className={`performance-meter-fill ${confidence < 0.3 ? 'bg-red-500' : confidence < 0.7 ? 'bg-yellow-500' : 'bg-green-500'}`} 
            style={{ width: `${confidence * 100}%` }}
          ></div>
        </div>
        <p className="text-sm mt-1 italic">{getFeedback('confidence', confidence)}</p>
      </div>

      {/* Speech patterns analysis */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Speech Patterns</h4>
        <ul className="text-sm space-y-1">
          {speechPatterns.map((pattern, index) => (
            <li key={index} className="flex justify-between">
              <span>{pattern.name}</span>
              <span className={
                'pattern' in pattern && pattern.status === 'Normal' || pattern.status === 'Good' || pattern.status === 'Optimal'
                  ? 'text-green-500' 
                  : pattern.status === 'Fair' || pattern.status === 'Slightly Fast' || pattern.status === 'Slightly Slow' || pattern.status === 'Moderate'
                    ? 'text-yellow-500'
                    : 'text-red-500'
              }>
                {pattern.count !== undefined ? pattern.count : pattern.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Live transcription */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Live Transcription</h4>
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm max-h-32 overflow-y-auto">
          {transcripts.slice(-3).map((text, i) => (
            <p key={i} className="mb-1 opacity-75">{text}</p>
          ))}
          {currentTranscript && (
            <p className="font-medium">{currentTranscript}</p>
          )}
          {!currentTranscript && !transcripts.length && isRecording && (
            <p className="text-gray-500 dark:text-gray-400 italic">Listening for speech...</p>
          )}
          {!isRecording && (
            <p className="text-gray-500 dark:text-gray-400 italic">Speech recognition paused</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeechAnalysis; 