import { useState, useEffect } from 'preact/hooks';
import { PhraseCard } from '../components/PhraseCard';
import { VoiceButton } from '../components/VoiceButton';
import { useSpeech } from '../hooks/useSpeech';
import { useSRS } from '../hooks/useSRS';
import { useStats } from '../hooks/useStats';
import { useFavorites } from '../hooks/useFavorites';
import { useSettings } from '../hooks/useSettings';
import type { Phrase, LanguageCode } from '../data';
import { getPhrasesByLanguage } from '../data';

interface SpeakModeProps {
  selectedLanguages: LanguageCode[];
  bedMode: boolean;
}

export function SpeakMode({ selectedLanguages, bedMode }: SpeakModeProps) {
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [feedback, setFeedback] = useState<string>('');
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { settings } = useSettings();
  const { recordPhraseStudy, updateAccuracy } = useStats();
  const { isFavorite, toggleFavorite } = useFavorites();
  const langMap: Record<LanguageCode, string> = {
    de: 'de-DE',
    fr: 'fr-FR',
    es: 'es-ES',
    ru: 'ru-RU',
    en: 'en-US',
  };
  const { speak, startListening, stopListening, isListening, isSpeaking, transcript } = useSpeech({
    lang: currentPhrase ? langMap[currentPhrase.language as LanguageCode] : 'en-US',
    playbackSpeed: settings.playbackSpeed,
    onResult: (text) => {
      if (currentPhrase) {
        const similarity = calculateSimilarity(text.toLowerCase(), currentPhrase.text.toLowerCase());
        if (similarity > 0.7) {
          setFeedback('✅ Great pronunciation!');
        } else if (similarity > 0.5) {
          setFeedback('⚠️ Close, try again!');
        } else {
          setFeedback('❌ Not quite right. Listen and try again.');
        }
      }
    },
  });
  const { getPriorityPhrases, updateSRS } = useSRS(phrases);

  useEffect(() => {
    const allPhrases = selectedLanguages.flatMap(lang => getPhrasesByLanguage(lang));
    setPhrases(allPhrases);
  }, [selectedLanguages]);

  useEffect(() => {
    if (phrases.length === 0) return;
    const priorityPhrases = getPriorityPhrases();
    const nextPhrase = priorityPhrases[0] || phrases[Math.floor(Math.random() * phrases.length)];
    setCurrentPhrase(nextPhrase);
    setShowTranslation(false);
    setFeedback('');
  }, [phrases, getPriorityPhrases]);

  useEffect(() => {
    if (transcript && currentPhrase) {
      const similarity = calculateSimilarity(transcript.toLowerCase(), currentPhrase.text.toLowerCase());
      const correct = similarity > 0.7;
      const quality = correct ? 5 : similarity > 0.5 ? 3 : 1;
      
      updateSRS(currentPhrase.id, quality);
      recordPhraseStudy(currentPhrase.id, currentPhrase.language, correct);
      
      setScore(prev => {
        const newScore = {
          correct: prev.correct + (correct ? 1 : 0),
          total: prev.total + 1,
        };
        updateAccuracy(newScore.correct, newScore.total);
        return newScore;
      });
    }
  }, [transcript, currentPhrase, updateSRS, recordPhraseStudy, updateAccuracy]);

  const handleSpeak = () => {
    if (currentPhrase) {
      speak(currentPhrase.text, langMap[currentPhrase.language as LanguageCode]);
      setShowTranslation(true);
    }
  };

  const handleNext = () => {
    const priorityPhrases = getPriorityPhrases();
    const nextPhrase = priorityPhrases[0] || phrases[Math.floor(Math.random() * phrases.length)];
    setCurrentPhrase(nextPhrase);
    setShowTranslation(false);
    setFeedback('');
  };

  const handleStartListening = () => {
    if (currentPhrase) {
      startListening(langMap[currentPhrase.language as LanguageCode]);
    }
  };

  if (!currentPhrase) {
    return (
      <div className="text-center text-gray-400 py-12">
        Select at least one language to start
      </div>
    );
  }

  return (
    <div className={`w-full ${bedMode ? 'max-w-4xl' : 'max-w-2xl'} mx-auto`}>
      <PhraseCard
        phrase={currentPhrase}
        showTranslation={showTranslation || settings.showTranslations}
        bedMode={bedMode}
        onSpeak={handleSpeak}
        isSpeaking={isSpeaking}
        isFavorite={currentPhrase ? isFavorite(currentPhrase.id) : false}
        onToggleFavorite={currentPhrase ? () => toggleFavorite(currentPhrase.id) : undefined}
      />
      
      <div className="flex flex-col items-center gap-4 mt-6">
        <VoiceButton
          isListening={isListening}
          isSpeaking={isSpeaking}
          onStartListening={handleStartListening}
          onStopListening={stopListening}
          onSpeak={handleSpeak}
          onStopSpeaking={() => {}}
          bedMode={bedMode}
        />
        
        {transcript && (
          <div className={`text-center ${bedMode ? 'text-2xl' : 'text-lg'} text-gray-300 mt-4`}>
            You said: "{transcript}"
          </div>
        )}
        
        {feedback && (
          <div className={`text-center ${bedMode ? 'text-2xl' : 'text-lg'} font-semibold mt-4`}>
            {feedback}
          </div>
        )}
        
        <button
          onClick={handleNext}
          className={`
            px-6 py-3 rounded-lg font-semibold bg-dark-accent 
            hover:bg-dark-accent/80 transition-colors
            ${bedMode ? 'text-xl' : ''}
          `}
        >
          Next Phrase →
        </button>
      </div>
    </div>
  );
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(str1, str2);
  return (longer.length - distance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

