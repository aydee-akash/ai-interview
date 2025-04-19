import React from 'react';
import { Container, Box } from '@mui/material';
import InterviewInterface from './components/InterviewInterface';

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <InterviewInterface />
      </Box>
    </Container>
  );
}

export default App; 