import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Alert, 
  ThemeProvider, 
  createTheme, 
  Paper,
  IconButton,
  Tooltip,
  Fade,
  Zoom
} from '@mui/material';
import styled from '@emotion/styled';
import axios from 'axios';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import TimerIcon from '@mui/icons-material/Timer';
import CameraIcon from '@mui/icons-material/Camera';
import ResultsPage from './ResultsPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7c4dff',
      light: '#b47cff',
      dark: '#3f1dcb',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff79b0',
      dark: '#c60055',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 16px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

interface FeedbackBoxProps {
  score: number | null;
}

const InterviewInterface: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [answers, setAnswers] = useState<Array<{ question: string; answer: string }>>([]);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questions, setQuestions] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isVideoMounted, setIsVideoMounted] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      
      // First get the camera stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 1280, 
          height: 720,
          facingMode: "user"
        } 
      });
      
      // Set the camera active state which will render the video element
      setIsCameraActive(true);
      
      // Wait for video element to be ready
      const checkVideoReady = () => {
        if (videoRef.current) {
          console.log('Setting video stream...');
          videoRef.current.srcObject = stream;
          
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded, playing...');
            videoRef.current?.play().catch(err => {
              console.error('Error playing video:', err);
            });
          };
        } else {
          console.log('Waiting for video element...');
          setTimeout(checkVideoReady, 100);
        }
      };
      
      checkVideoReady();
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setFeedback('Error accessing camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      console.log('Camera stopped');
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error('API key not found');
        }

        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            contents: [{
              parts: [{
                text: "Generate 5 really very very easy short answer(like one line) common technical oral interview questions for a college student. Format each question on a new line."
              }]
            }]
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          const questionsText = response.data.candidates[0].content.parts[0].text;
          const questionsList = questionsText.split('\n').filter((q: string) => q.trim());
          setQuestions(questionsList);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions([
          'Tell me about your experience with React and its core concepts.',
          'How do you handle state management in large applications?',
          'Explain the difference between class components and functional components.',
          'What are React hooks and how do you use them?',
          'How do you optimize React application performance?'
        ]);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
      setTranscript('');
      setTimeElapsed(0);
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setAnswers(prev => [...prev, { 
        question: questions[currentQuestion], 
        answer: transcript 
      }]);
      setTranscript('');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleSubmitInterview = async () => {
    setIsLoading(true);
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API key not found. Please check your environment variables.');
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          contents: [{
            parts: [{
              text: `Evaluate this technical interview. Questions and answers: ${JSON.stringify(answers)}. 
              Provide a score out of 100 and specific feedback on areas for improvement.`
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.candidates && response.data.candidates[0]) {
        const result = response.data.candidates[0].content.parts[0].text;
        setFeedback(result);
        const scoreMatch = result.match(/(\d+)\/100/);
        if (scoreMatch) {
          setScore(parseInt(scoreMatch[1]));
        }
        setShowResults(true);
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (error: any) {
      console.error('Error getting feedback:', error);
      setFeedback(`Error: ${error.message || 'Failed to get feedback. Please try again.'}`);
      setScore(0);
      setShowResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (questions.length === 0) {
    return (
      <ThemeProvider theme={darkTheme}>
        <LoadingContainer>
          <Typography variant="h5" color="primary">
            Preparing your interview questions...
          </Typography>
          <CircularProgress color="primary" size={40} />
        </LoadingContainer>
      </ThemeProvider>
    );
  }

  if (showResults) {
    return (
      <ResultsPage
        score={score || 0}
        feedback={feedback}
        answers={answers}
        onBack={() => setShowResults(false)}
      />
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <InterviewContainer>
        <Header>
          <Typography variant="h4" color="primary">
            AI Interview Assistant
          </Typography>
          <HeaderActions>
            <Tooltip title="Settings" arrow>
              <IconButton color="primary">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Help" arrow>
              <IconButton color="primary">
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </HeaderActions>
        </Header>

        <MainContent>
          <VideoSection>
            {!isCameraActive ? (
              <CameraPlaceholder>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Initializing camera...
                </Typography>
                <CircularProgress color="primary" />
              </CameraPlaceholder>
            ) : (
              <>
                <VideoFeed 
                  ref={videoRef}
                  onLoad={() => setIsVideoReady(true)}
                  autoPlay 
                  muted 
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)',
                    backgroundColor: '#000',
                    display: 'block'
                  }}
                />
                <StatusOverlay>
                  <RecordingStatus isRecording={isRecording}>
                    {isRecording ? 'Recording...' : 'Ready'}
                  </RecordingStatus>
                  <Timer>
                    <TimerIcon fontSize="small" />
                    {formatTime(timeElapsed)}
                  </Timer>
                </StatusOverlay>
              </>
            )}
          </VideoSection>

          <ContentSection>
            <QuestionBox elevation={3}>
              <QuestionHeader>
                <QuestionAnswerIcon color="primary" />
                <Typography variant="h6" color="primary">
                  Question {currentQuestion + 1} of {questions.length}
                </Typography>
              </QuestionHeader>
              <QuestionText variant="h5" color="text.primary">
                {questions[currentQuestion]}
              </QuestionText>
            </QuestionBox>

            <AnswerBox elevation={3}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Your Answer:
              </Typography>
              <AnswerText>
                {transcript || 'Start speaking to record your answer...'}
              </AnswerText>
            </AnswerBox>

            <Controls>
              <Button
                variant="contained"
                color={isRecording ? "error" : "primary"}
                startIcon={isRecording ? <MicOffIcon /> : <MicIcon />}
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                sx={{ mr: 2, minWidth: 200 }}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>

              {currentQuestion < questions.length - 1 ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleNextQuestion}
                  disabled={!answers[currentQuestion]}
                  sx={{ minWidth: 200 }}
                >
                  Next Question
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmitInterview}
                  disabled={isLoading}
                  sx={{ minWidth: 200 }}
                >
                  Submit Interview
                </Button>
              )}
            </Controls>

            {score !== null && (
              <Fade in={true} timeout={500}>
                <FeedbackBox elevation={3} score={score}>
                  <FeedbackHeader>
                    <AssessmentIcon color="primary" />
                    <Typography variant="h6" color="primary">
                      Interview Results
                    </Typography>
                  </FeedbackHeader>
                  <ScoreDisplay>
                    <CircularProgressbar
                      value={score}
                      text={`${score}%`}
                      styles={{
                        path: { stroke: `rgba(124, 77, 255, ${score / 100})` },
                        text: { fill: '#7c4dff', fontSize: '24px', fontWeight: 'bold' },
                        trail: { stroke: '#2d2d2d' }
                      }}
                    />
                  </ScoreDisplay>
                  <FeedbackText>
                    {feedback}
                  </FeedbackText>
                </FeedbackBox>
              </Fade>
            )}
          </ContentSection>
        </MainContent>
      </InterviewContainer>
    </ThemeProvider>
  );
};

const InterviewContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: #0a0a0a;
  display: flex;
  flex-direction: column;
  padding: 12px;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;

  @media (max-width: 600px) {
    padding: 8px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 8px;
  height: 40px;
  flex-wrap: wrap;
  gap: 8px;

  @media (max-width: 600px) {
    height: auto;
    margin-bottom: 8px;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 600px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const MainContent = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 64px);
  gap: 12px;
  flex: 1;

  @media (max-width: 1200px) {
    flex-direction: column;
    height: auto;
    min-height: calc(100vh - 64px);
  }

  @media (max-width: 600px) {
    gap: 8px;
  }
`;

const VideoSection = styled.div`
  flex: 1;
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  min-height: 300px;

  @media (max-width: 1200px) {
    height: 400px;
  }

  @media (max-width: 600px) {
    height: 300px;
    border-radius: 4px;
  }
`;

const StatusOverlay = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;

  @media (max-width: 600px) {
    top: 12px;
    right: 12px;
    gap: 4px;
  }
`;

const RecordingStatus = styled.div<{ isRecording: boolean }>`
  background: ${props => props.isRecording ? '#ff4081' : '#4CAF50'};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  @media (max-width: 600px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const Timer = styled.div`
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;

  @media (max-width: 600px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

const ContentSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 400px;
  height: 100%;
  overflow: hidden;

  @media (max-width: 1200px) {
    min-width: 0;
    height: auto;
  }

  @media (max-width: 600px) {
    gap: 8px;
  }
`;

const QuestionBox = styled(Paper)`
  padding: 12px;
  background: #1a1a1a;
  height: 100px;
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    padding: 8px;
    height: auto;
    min-height: 80px;
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  height: 24px;

  @media (max-width: 600px) {
    margin-bottom: 4px;
  }
`;

const QuestionText = styled(Typography)`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 16px;
  line-height: 1.4;

  @media (max-width: 600px) {
    font-size: 14px;
    line-height: 1.3;
  }
`;

const AnswerBox = styled(Paper)`
  padding: 12px;
  background: #1a1a1a;
  flex: 1;
  min-height: 0;

  @media (max-width: 600px) {
    padding: 8px;
  }
`;

const AnswerText = styled.div`
  margin-top: 12px;
  padding: 12px;
  background: #2d2d2d;
  border-radius: 8px;
  height: calc(100% - 48px);
  color: #e0e0e0;
  font-size: 14px;
  line-height: 1.5;
  overflow: hidden;

  @media (max-width: 600px) {
    margin-top: 8px;
    padding: 8px;
    font-size: 13px;
    line-height: 1.4;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
  padding: 8px 0;
  height: 60px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    gap: 8px;
    margin-top: 8px;
    height: auto;
  }
`;

const FeedbackBox = styled(Paper)<FeedbackBoxProps>`
  padding: 12px;
  background: #1a1a1a;
  margin-top: 12px;
  height: 200px;
  display: ${props => props.score === null ? 'none' : 'block'};

  @media (max-width: 600px) {
    padding: 8px;
    height: auto;
    min-height: 150px;
  }
`;

const FeedbackHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    margin-bottom: 16px;
  }
`;

const ScoreDisplay = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 12px;

  @media (max-width: 600px) {
    width: 80px;
    height: 80px;
  }
`;

const FeedbackSection = styled.div`
  width: 100%;
  background: #1a1a1a;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-height: 60vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1a1a;
  }

  &::-webkit-scrollbar-thumb {
    background: #7c4dff;
    border-radius: 3px;
  }
`;

const FeedbackText = styled.div`
  white-space: pre-wrap;
  line-height: 1.8;
  color: #e0e0e0;
  font-size: 16px;
  padding: 20px;
  background: #2d2d2d;
  border-radius: 8px;
  
  p {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: #7c4dff;
    font-weight: 600;
  }

  ul, ol {
    margin: 16px 0;
    padding-left: 24px;
  }

  li {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ResultsContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: #0a0a0a;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const ResultsContent = styled.div`
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`;

const ScoreSection = styled.div`
  text-align: center;
`;

const LoadingContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: #0a0a0a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;

  @media (max-width: 600px) {
    gap: 16px;
  }
`;

const VideoFeed = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scaleX(-1);
  background-color: #000;
  display: block;
`;

const CameraPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #1a1a1a;
  border-radius: 8px;

  @media (max-width: 600px) {
    border-radius: 4px;
  }
`;

export default InterviewInterface; 