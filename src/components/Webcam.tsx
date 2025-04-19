import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Box, Button, Typography } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

interface WebcamComponentProps {
  onCapture?: (imageSrc: string) => void;
}

const WebcamComponent: React.FC<WebcamComponentProps> = ({ onCapture }) => {
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  };

  const handleStartCamera = () => {
    setIsCameraOn(true);
  };

  const handleStopCamera = () => {
    setIsCameraOn(false);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: 2,
      p: 2,
      border: '1px solid #ccc',
      borderRadius: 2
    }}>
      {isCameraOn ? (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ borderRadius: '8px' }}
          />
          <Button
            variant="contained"
            color="error"
            startIcon={<VideocamOffIcon />}
            onClick={handleStopCamera}
          >
            Stop Camera
          </Button>
        </>
      ) : (
        <Button
          variant="contained"
          color="primary"
          startIcon={<VideocamIcon />}
          onClick={handleStartCamera}
        >
          Start Camera
        </Button>
      )}
    </Box>
  );
};

export default WebcamComponent; 