import { useState, useEffect, useRef } from 'preact/hooks';
import { PhraseCard } from '../components/PhraseCard';
import { useSpeech } from '../hooks/useSpeech';
import { useSRS } from '../hooks/useSRS';
import { useStats } from '../hooks/useStats';
import { useFavorites } from '../hooks/useFavorites';
import { useSettings } from '../hooks/useSettings';
import type { Phrase, LanguageCode } from '../data';
import { getPhrasesByLanguage } from '../data';

interface ListenModeProps {
  selectedLanguages: LanguageCode[];
  bedMode: boolean;
  autoPlay: boolean;
  interval: number;
}

export function ListenMode({ 
  selectedLanguages, 
  bedMode, 
  autoPlay,
  interval = 3000,
}: ListenModeProps) {
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const intervalRef = useRef<number | null>(null);
  const { settings } = useSettings();
  const { recordPhraseStudy } = useStats();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { speak, isSpeaking } = useSpeech({ playbackSpeed: settings.playbackSpeed });
  const { getPriorityPhrases } = useSRS(phrases);

  useEffect(() => {
    // Load phrases for selected languages
    const allPhrases = selectedLanguages.flatMap(lang => getPhrasesByLanguage(lang));
    setPhrases(allPhrases);
  }, [selectedLanguages]);

  useEffect(() => {
    if (phrases.length === 0) return;

    // Get next phrase using SRS priority
    const priorityPhrases = getPriorityPhrases();
    const nextPhrase = priorityPhrases[0] || phrases[Math.floor(Math.random() * phrases.length)];
    setCurrentPhrase(nextPhrase);
    setShowTranslation(false);

    if (autoPlay) {
      const langMap: Record<LanguageCode, string> = {
        de: 'de-DE',
        fr: 'fr-FR',
        es: 'es-ES',
        ru: 'ru-RU',
        en: 'en-US',
      };
      speak(nextPhrase.text, langMap[nextPhrase.language as LanguageCode]);
      recordPhraseStudy(nextPhrase.id, nextPhrase.language, true);
      
      // Show translation after a delay
      setTimeout(() => setShowTranslation(true), interval / 2);
    }
  }, [phrases, autoPlay, interval, getPriorityPhrases, speak, recordPhraseStudy]);

  useEffect(() => {
    if (!autoPlay || phrases.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      const priorityPhrases = getPriorityPhrases();
      const nextPhrase = priorityPhrases[0] || phrases[Math.floor(Math.random() * phrases.length)];
      setCurrentPhrase(nextPhrase);
      setShowTranslation(false);

      const langMap: Record<LanguageCode, string> = {
        de: 'de-DE',
        fr: 'fr-FR',
        es: 'es-ES',
        ru: 'ru-RU',
        en: 'en-US',
      };
      speak(nextPhrase.text, langMap[nextPhrase.language as LanguageCode]);
      recordPhraseStudy(nextPhrase.id, nextPhrase.language, true);
      
      setTimeout(() => setShowTranslation(true), interval / 2);
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, phrases, interval, speak, getPriorityPhrases, recordPhraseStudy]);

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
      setShowTranslation(true);
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
      {bedMode && (
        <div className="text-center text-gray-500 text-xl mt-8">
          Auto-scrolling enabled
        </div>
      )}
    </div>
  );
}

