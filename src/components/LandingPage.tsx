import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  ThemeProvider,
  createTheme,
  styled
} from '@mui/material';
import InterviewInterface from './InterviewInterface';

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
});

const LandingPage: React.FC = () => {
  const [startInterview, setStartInterview] = useState(false);

  if (startInterview) {
    return <InterviewInterface />;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <LandingContainer>
        <ContentBox elevation={3}>
          <Typography variant="h3" color="primary" sx={{ mb: 4 }}>
            AI Interview Assistant
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 6 }}>
            Practice your technical interview skills with AI-powered feedback
          </Typography>
          <FeaturesList>
            <FeatureItem>
              <Typography variant="body1" color="text.primary">
                • Real-time speech recognition
              </Typography>
            </FeatureItem>
            <FeatureItem>
              <Typography variant="body1" color="text.primary">
                • AI-powered feedback and scoring
              </Typography>
            </FeatureItem>
            <FeatureItem>
              <Typography variant="body1" color="text.primary">
                • Detailed performance analysis
              </Typography>
            </FeatureItem>
          </FeaturesList>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setStartInterview(true)}
            sx={{ mt: 6, px: 6, py: 2, fontSize: '1.2rem' }}
          >
            Start Interview
          </Button>
        </ContentBox>
      </LandingContainer>
    </ThemeProvider>
  );
};

const LandingContainer = styled(Box)`
  height: 100vh;
  width: 100vw;
  background: #0a0a0a;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const ContentBox = styled(Paper)`
  max-width: 800px;
  width: 100%;
  padding: 48px;
  text-align: center;
  background: #1a1a1a;
  border-radius: 16px;
`;

const FeaturesList = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: 32px 0;
`;

const FeatureItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default LandingPage; 