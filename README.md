
# PerformaAI: Real-Time AI Mock Interviewer & Performance Analyzer

PerformaAI is an advanced AI-driven mock interview system that provides real-time analysis of interview performance including facial expressions, speech patterns, content relevance, and more.

## Features

- **Real-time Video Analysis**: Tracks eye contact, facial expressions, and body language
- **Speech Analysis**: Analyzes clarity, confidence, and speaking patterns
- **Content Evaluation**: Assesses the relevance and depth of interview responses
- **Emotional Intelligence**: Gauges emotional cues and stress levels
- **Comprehensive Performance Metrics**: Provides detailed scoring and visualization
- **Personalized Improvement Tips**: Offers actionable feedback for better performance

## Technology Stack

- Next.js 14+ with TypeScript for robust frontend development
- React 18+ for UI components and state management
- Tailwind CSS for responsive and customizable styling
- face-api.js for facial expression analysis and tracking
- React Webcam for camera integration and video capture
- Framer Motion for smooth animations and transitions
- Web Speech API and react-speech-recognition for voice analysis
- Chart.js and react-chartjs-2 for performance visualization
- OpenAI integration for interview question generation and response analysis

## How It Works

PerformaAI leverages several AI technologies to provide comprehensive interview analysis:

1. **Facial Analysis**: Using face-api.js, the application detects and analyzes facial expressions in real-time. This includes tracking eye movement, detecting smiles, frowns, and other expressions that indicate confidence, nervousness, or engagement.

2. **Voice Analysis**: Through Web Speech API and react-speech-recognition, the system evaluates speech patterns including:
   - Speech clarity and pronunciation
   - Speaking pace and rhythm
   - Voice modulation and tone
   - Filler words usage (um, uh, like)
   - Speaking confidence indicators

3. **Content Analysis**: Using OpenAI integration, responses are evaluated for:
   - Relevance to the question
   - Depth and thoroughness
   - Structure and coherence
   - Professional language usage
   - Key point coverage

4. **Performance Metrics**: All collected data is processed to generate:
   - Comprehensive scoring across multiple dimensions
   - Visual representations of performance via charts
   - Comparison to benchmark standards
   - Identification of strengths and areas for improvement

## Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Modern web browser with camera and microphone support

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/performa-ai.git
   cd performa-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup:**
   - Create a `.env.local` file in the root directory
   - Add any required API keys:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```

4. **Build the application:**
   ```bash
   npm run build
   # or
   yarn build
   ```

5. **Start the production server:**
   ```bash
   npm run start
   # or
   yarn start
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000)

## Development Mode

To run the application in development mode:

```bash
npm run dev
# or
yarn dev
```

This starts the application with hot-reload enabled, allowing you to see changes in real-time as you modify the code.

## Usage Guide

### Starting an Interview

1. Navigate to the homepage and click "Start Interview"
2. Grant camera and microphone permissions when prompted
3. Choose an interview type (general, technical, behavioral)
4. Adjust settings if needed (interview duration, difficulty level)
5. Click "Begin Interview" to start

### During the Interview

1. Face the camera directly, ensuring good lighting
2. Answer the questions naturally as you would in a real interview
3. Real-time feedback indicators will appear on screen
4. You can pause the interview if needed using the control panel

### After the Interview

1. Review your comprehensive performance summary
2. Explore detailed metrics in each category (facial expressions, voice, content)
3. Read the personalized improvement suggestions
4. Save or export your results if desired
5. Optionally replay portions of your interview with annotations

## Custom Interview Setup

You can customize your interview experience:
- Select from predefined question banks for different industries
- Set difficulty levels based on your experience
- Adjust the focus areas (technical skills, communication, problem-solving)
- Configure the duration and number of questions

## Troubleshooting

### Common Issues

- **Camera/Microphone not working**: Ensure browser permissions are granted and no other application is using these devices
- **Performance issues**: Close other resource-intensive applications and ensure a stable internet connection
- **Analysis not appearing**: Refresh the page and ensure JavaScript is enabled

### Browser Compatibility

PerformaAI works best on:
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Edge (latest 2 versions)
- Safari (latest 2 versions)

## Project Structure

```
performa-ai/
├── app/                # Next.js app directory
│   ├── components/     # React components
│   ├── context/        # React context providers
│   ├── lib/            # Utility functions and helpers
│   ├── styles/         # Global styles
│   ├── interview/      # Interview page
│   ├── demo/           # Demo page
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Homepage
├── public/             # Static assets
│   ├── models/         # face-api.js models
│   ├── images/         # Static images
│   └── fonts/          # Custom fonts
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies
```

## Deployment

PerformaAI can be deployed to various platforms:

### Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify login
netlify deploy
```

### Docker
```bash
docker build -t performa-ai .
docker run -p 3000:3000 performa-ai
```

## Future Enhancements

- Integration with more advanced AI models for deeper analysis
- Industry-specific interview question banks
- Video recording and playback of interviews with timestamps
- Multi-language support for global accessibility
- Interview scheduling and reminder system
- Comparison with previous performances to track improvement
- Mobile application for on-the-go practice

## Contributing

We welcome contributions to PerformaAI! Please see our CONTRIBUTING.md file for guidelines on how to contribute.

## Acknowledgments

- This project was created as a demonstration of AI-driven interview preparation tools
- Inspired by the need for more interactive and insightful interview practice
- Thanks to all open-source libraries and frameworks that made this possible

---

Built with ❤️ for better interview experiences. Copyright © 2024 Hashim. 
=======
# Mock_Interview_AI
An AI-powered mock interview platform built with React.js and styled using Tailwind CSS. This tool simulates real-time interview sessions, analyzing voice, facial expressions, and textual responses to provide instant feedback. Ideal for students and professionals to prepare for job interviews with intelligent, automated insights.
