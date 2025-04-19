declare module 'react-speech-recognition' {
  interface SpeechRecognitionOptions {
    continuous?: boolean;
    interimResults?: boolean;
    lang?: string;
  }

  interface SpeechRecognitionResult {
    transcript: string;
    confidence: number;
  }

  interface SpeechRecognitionState {
    transcript: string;
    listening: boolean;
    browserSupportsSpeechRecognition: boolean;
    resetTranscript: () => void;
    startListening: (options?: SpeechRecognitionOptions) => Promise<void>;
    stopListening: () => void;
  }

  export function useSpeechRecognition(options?: SpeechRecognitionOptions): SpeechRecognitionState;
} 