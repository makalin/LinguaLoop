import { JSX } from 'preact';

interface VoiceButtonProps {
  isListening: boolean;
  isSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onSpeak: () => void;
  onStopSpeaking: () => void;
  bedMode?: boolean;
}

export function VoiceButton({
  isListening,
  isSpeaking,
  onStartListening,
  onStopListening,
  onSpeak,
  onStopSpeaking,
  bedMode = false,
}: VoiceButtonProps): JSX.Element {
  const size = bedMode ? 'w-24 h-24 text-4xl' : 'w-16 h-16 text-2xl';

  if (isListening) {
    return (
      <button
        onClick={onStopListening}
        className={`
          ${size} rounded-full bg-red-600 hover:bg-red-700 
          active:bg-red-800 flex items-center justify-center
          transition-all shadow-lg animate-pulse
        `}
        aria-label="Stop listening"
      >
        🎤
      </button>
    );
  }

  if (isSpeaking) {
    return (
      <button
        onClick={onStopSpeaking}
        className={`
          ${size} rounded-full bg-blue-600 hover:bg-blue-700 
          active:bg-blue-800 flex items-center justify-center
          transition-all shadow-lg
        `}
        aria-label="Stop speaking"
      >
        🔊
      </button>
    );
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={onStartListening}
        className={`
          ${size} rounded-full bg-green-600 hover:bg-green-700 
          active:bg-green-800 flex items-center justify-center
          transition-all shadow-lg
        `}
        aria-label="Start listening"
      >
        🎤
      </button>
      <button
        onClick={onSpeak}
        className={`
          ${size} rounded-full bg-blue-600 hover:bg-blue-700 
          active:bg-blue-800 flex items-center justify-center
          transition-all shadow-lg
        `}
        aria-label="Speak"
      >
        🔊
      </button>
    </div>
  );
}

