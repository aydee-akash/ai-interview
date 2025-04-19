import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      p: 2,
      border: '1px solid #ccc',
      borderRadius: 2,
      maxHeight: '400px',
      overflowY: 'auto'
    }}>
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
            gap: 1,
            alignItems: 'flex-start'
          }}
        >
          <Avatar sx={{ bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main' }}>
            {message.role === 'user' ? <PersonIcon /> : <SmartToyIcon />}
          </Avatar>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              maxWidth: '70%',
              bgcolor: message.role === 'user' ? 'primary.light' : 'secondary.light',
              color: message.role === 'user' ? 'primary.contrastText' : 'secondary.contrastText'
            }}
          >
            <Typography variant="body1">{message.content}</Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default ChatInterface; 