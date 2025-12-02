import { useState, useEffect } from 'preact/hooks';
import { PhraseCard } from '../components/PhraseCard';
import { useSpeech } from '../hooks/useSpeech';
import { useSRS } from '../hooks/useSRS';
import { useStats } from '../hooks/useStats';
import { useFavorites } from '../hooks/useFavorites';
import { useSettings } from '../hooks/useSettings';
import type { Phrase, LanguageCode } from '../data';
import { getPhrasesByLanguage } from '../data';

interface QuizModeProps {
  selectedLanguages: LanguageCode[];
  bedMode: boolean;
}

export function QuizMode({ selectedLanguages, bedMode }: QuizModeProps) {
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const { settings } = useSettings();
  const { recordPhraseStudy, updateAccuracy } = useStats();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { speak, isSpeaking } = useSpeech({ playbackSpeed: settings.playbackSpeed });
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
    setShowAnswer(false);
  }, [phrases, score.total, getPriorityPhrases]);

  const handleSpeak = () => {
    if (currentPhrase) {
      const langMap: Record<LanguageCode, string> = {
        de: 'de-DE',
        fr: 'fr-FR',
        es: 'es-ES',
        ru: 'ru-RU',
        en: 'en-US',
      };
      speak(currentPhrase.text, langMap[currentPhrase.language as LanguageCode]);
    }
  };

  const handleReveal = () => {
    setShowAnswer(true);
  };

  const handleAnswer = (correct: boolean) => {
    if (currentPhrase) {
      updateSRS(currentPhrase.id, correct ? 5 : 0);
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
    setShowAnswer(false);
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
      <div className={`text-center mb-6 ${bedMode ? 'text-3xl' : 'text-xl'} font-bold`}>
        Score: {score.correct}/{score.total}
      </div>
      
      <PhraseCard
        phrase={currentPhrase}
        showTranslation={showAnswer || settings.showTranslations}
        bedMode={bedMode}
        onSpeak={handleSpeak}
        isSpeaking={isSpeaking}
        isFavorite={currentPhrase ? isFavorite(currentPhrase.id) : false}
        onToggleFavorite={currentPhrase ? () => toggleFavorite(currentPhrase.id) : undefined}
      />
      
      <div className="flex flex-col gap-4 mt-6">
        {!showAnswer ? (
          <button
            onClick={handleReveal}
            className={`
              px-6 py-3 rounded-lg font-semibold bg-blue-600 
              hover:bg-blue-700 transition-colors
              ${bedMode ? 'text-xl' : ''}
            `}
          >
            Reveal Answer
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => handleAnswer(true)}
              className={`
                flex-1 px-6 py-3 rounded-lg font-semibold bg-green-600 
                hover:bg-green-700 transition-colors
                ${bedMode ? 'text-xl' : ''}
              `}
            >
              ✅ Correct
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className={`
                flex-1 px-6 py-3 rounded-lg font-semibold bg-red-600 
                hover:bg-red-700 transition-colors
                ${bedMode ? 'text-xl' : ''}
              `}
            >
              ❌ Wrong
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

