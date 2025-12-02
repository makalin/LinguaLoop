import { useState, useEffect, useRef, useCallback } from 'preact/hooks';

interface UseSpeechOptions {
  lang?: string;
  playbackSpeed?: number;
  onResult?: (text: string) => void;
  onError?: (error: Error) => void;
}

export function useSpeech(options: UseSpeechOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = options.lang || 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        options.onResult?.(text);
      };

      recognitionRef.current.onerror = (event: any) => {
        const error = new Error(event.error || 'Speech recognition error');
        options.onError?.(error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    synthesisRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [options.lang]);

  const speak = useCallback((text: string, lang?: string) => {
    if (!synthesisRef.current) return;

    synthesisRef.current.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang || options.lang || 'en-US';
    utterance.rate = options.playbackSpeed || 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current.speak(utterance);
  }, [options.lang, options.playbackSpeed]);

  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const startListening = useCallback((lang?: string) => {
    if (!recognitionRef.current) {
      options.onError?.(new Error('Speech recognition not supported'));
      return;
    }

    if (lang) {
      recognitionRef.current.lang = lang;
    }

    try {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript('');
    } catch (error) {
      options.onError?.(error as Error);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return {
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    isListening,
    isSpeaking,
    transcript,
  };
}

