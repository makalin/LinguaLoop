import { JSX } from 'preact';
import type { Phrase } from '../data';

interface PhraseCardProps {
  phrase: Phrase;
  showTranslation?: boolean;
  bedMode?: boolean;
  onSpeak?: () => void;
  isSpeaking?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function PhraseCard({ 
  phrase, 
  showTranslation = false, 
  bedMode = false,
  onSpeak,
  isSpeaking = false,
  isFavorite = false,
  onToggleFavorite,
}: PhraseCardProps): JSX.Element {
  return (
    <div 
      className={`
        bg-dark-surface rounded-lg p-6 mb-4 transition-all relative
        ${bedMode ? 'text-4xl md:text-5xl' : 'text-xl md:text-2xl'}
        ${isSpeaking ? 'ring-2 ring-blue-500' : ''}
      `}
    >
      {onToggleFavorite && (
        <button
          onClick={onToggleFavorite}
          className={`
            absolute top-4 right-4 p-2 rounded-full transition-colors
            ${isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'}
            ${bedMode ? 'text-3xl' : 'text-xl'}
          `}
          aria-label="Toggle favorite"
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
      )}
      <div className="text-center mb-4">
        <div className={`font-bold ${bedMode ? 'mb-6' : 'mb-2'}`}>
          {phrase.text}
        </div>
        {showTranslation && (
          <div className={`text-gray-400 ${bedMode ? 'text-3xl' : 'text-lg'}`}>
            {phrase.translation}
          </div>
        )}
      </div>
      {onSpeak && (
        <button
          onClick={onSpeak}
          disabled={isSpeaking}
          className={`
            w-full py-3 px-4 rounded-lg font-semibold transition-colors
            ${isSpeaking 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }
            ${bedMode ? 'text-2xl' : ''}
          `}
        >
          {isSpeaking ? 'Speaking...' : '🔊 Speak'}
        </button>
      )}
    </div>
  );
}

