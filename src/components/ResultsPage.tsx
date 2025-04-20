import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  ThemeProvider, 
  createTheme,
  Grid,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  Zoom
} from '@mui/material';
import styled from '@emotion/styled';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

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
});

interface ResultsPageProps {
  score: number;
  feedback: string;
  answers: Array<{ question: string; answer: string }>;
  onBack: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ score, feedback, answers, onBack }) => {
  const renderStars = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score / 20);
    const hasHalfStar = score % 20 >= 10;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} color="primary" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalfIcon key={i} color="primary" />);
      } else {
        stars.push(<StarBorderIcon key={i} color="primary" />);
      }
    }
    
    return stars;
  };

  const handleDownload = () => {
    // Create a PDF or text file with the results
    const content = `Interview Results\n\nScore: ${score}%\n\nFeedback:\n${feedback}\n\nQuestions and Answers:\n${answers.map((qa, index) => `\n${index + 1}. ${qa.question}\nAnswer: ${qa.answer}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview-results.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Interview Results',
        text: `I scored ${score}% on my AI interview! Check out my detailed feedback.`,
      }).catch(console.error);
    }
  };

  const formatFeedback = (feedback: string) => {
    const sections = feedback.split('\n\n');
    return sections.map((section, index) => {
      // Remove all asterisks and extra whitespace
      const cleanSection = section.replace(/\*/g, '').trim();
      
      if (cleanSection.startsWith('Detailed Breakdown and Feedback:')) {
        return `<p class="feedback-section"><strong>${cleanSection}</strong></p>`;
      } else if (cleanSection.includes('Expected Answer:')) {
        const [question, rest] = cleanSection.split('Expected Answer:');
        const [answer, feedback] = rest.split('Feedback:');
        
        return `
          <div class="question-block">
            <div class="question-title">${question.trim()}</div>
            <div class="expected-answer">
              <strong>Expected Answer:</strong>
              <div class="answer-text">${answer.trim()}</div>
            </div>
            <div class="feedback-text">
              <strong>Feedback:</strong>
              <div class="feedback-content">${feedback.trim()}</div>
            </div>
          </div>
        `;
      }
      return `<p>${cleanSection}</p>`;
    }).join('');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <ResultsContainer>
        <Header>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            color="primary"
            sx={{ mr: 2 }}
          >
            Back to Interview
          </Button>
          <Typography variant="h4" color="primary">
            Interview Results
          </Typography>
          <HeaderActions>
            <Tooltip title="Download Results" arrow>
              <IconButton color="primary" onClick={handleDownload}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share Results" arrow>
              <IconButton color="primary" onClick={handleShare}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </HeaderActions>
        </Header>

        <MainContent>
          <ScoreSection>
            <ScoreCard elevation={3}>
              <ScoreHeader>
                <AssessmentIcon color="primary" fontSize="large" />
                <Typography variant="h5" color="primary">
                  Overall Score
                </Typography>
              </ScoreHeader>
              <ScoreDisplay>
                <CircularProgressbar
                  value={score}
                  text={`${score}%`}
                  styles={{
                    path: { stroke: `rgba(124, 77, 255, ${score / 100})` },
                    text: { fill: '#7c4dff', fontSize: '32px', fontWeight: 'bold' },
                    trail: { stroke: '#2d2d2d' }
                  }}
                />
              </ScoreDisplay>
              <StarRating>
                {renderStars(score)}
              </StarRating>
              <PerformanceText>
                {score >= 80 ? 'Excellent Performance!' :
                 score >= 60 ? 'Good Job!' :
                 score >= 40 ? 'Keep Practicing!' :
                 'Room for Improvement'}
              </PerformanceText>
            </ScoreCard>
          </ScoreSection>

          <FeedbackSection>
            <FeedbackCard elevation={3}>
              <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                Detailed Feedback
              </Typography>
              <FeedbackText dangerouslySetInnerHTML={{ 
                __html: formatFeedback(feedback)
              }} />
            </FeedbackCard>
          </FeedbackSection>

          <QASection>
            <QACard elevation={3}>
              <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                Questions and Answers
              </Typography>
              {answers.map((qa, index) => (
                <QABlock key={index}>
                  <Question>
                    <Typography variant="subtitle1" color="primary">
                      Question {index + 1}
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                      {qa.question}
                    </Typography>
                  </Question>
                  <Answer>
                    <Typography variant="subtitle1" color="primary">
                      Your Answer
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {qa.answer}
                    </Typography>
                  </Answer>
                  {index < answers.length - 1 && <Divider sx={{ my: 2 }} />}
                </QABlock>
              ))}
            </QACard>
          </QASection>
        </MainContent>
      </ResultsContainer>
    </ThemeProvider>
  );
};

const ResultsContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: #0a0a0a;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 8px;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const ScoreSection = styled.div`
  display: flex;
  justify-content: center;
`;

const ScoreCard = styled(Paper)`
  padding: 24px;
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const ScoreHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const ScoreDisplay = styled.div`
  width: 200px;
  height: 200px;
  margin: 0 auto 16px;
`;

const StarRating = styled.div`
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 16px;
`;

const PerformanceText = styled(Typography)`
  color: #7c4dff;
  font-weight: 600;
  font-size: 1.2rem;
`;

const FeedbackSection = styled.div`
  width: 100%;
`;

const FeedbackCard = styled(Paper)`
  padding: 24px;
  background: #1a1a1a;
`;

const FeedbackText = styled.div`
  white-space: pre-wrap;
  line-height: 1.5;
  color: #e0e0e0;
  font-size: 16px;
  padding: 16px;
  background: #2d2d2d;
  border-radius: 8px;
  
  p {
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: #7c4dff;
    font-weight: 600;
  }

  .feedback-section {
    margin-bottom: 16px;
    font-size: 1.1em;
  }

  .question-block {
    margin-bottom: 16px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  .question-title {
    color: #7c4dff;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 1.1em;
  }

  .expected-answer {
    margin-bottom: 8px;
    
    strong {
      display: block;
      margin-bottom: 4px;
    }
    
    .answer-text {
      background: rgba(124, 77, 255, 0.1);
      padding: 8px 12px;
      border-radius: 4px;
      border-left: 3px solid #7c4dff;
      margin-left: 4px;
    }
  }

  .feedback-text {
    strong {
      display: block;
      margin-bottom: 4px;
    }
    
    .feedback-content {
      color: #b0b0b0;
      font-style: italic;
      margin-left: 4px;
    }
  }
`;

const QASection = styled.div`
  width: 100%;
`;

const QACard = styled(Paper)`
  padding: 24px;
  background: #1a1a1a;
`;

const QABlock = styled.div`
  margin-bottom: 16px;
`;

const Question = styled.div`
  margin-bottom: 16px;
`;

const Answer = styled.div`
  background: #2d2d2d;
  padding: 16px;
  border-radius: 8px;
`;

export default ResultsPage; 