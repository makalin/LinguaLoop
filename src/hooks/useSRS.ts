import { useState, useEffect, useCallback } from 'preact/hooks';
import type { Phrase } from '../data';

interface SRSItem {
  phraseId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  lastReview: number;
  nextReview: number;
}

const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const EASE_FACTOR_CHANGE = 0.15;

export function useSRS(phrases: Phrase[]) {
  const [srsData, setSrsData] = useState<Record<string, SRSItem>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load SRS data from localStorage
    const stored = localStorage.getItem('lingualoop-srs');
    if (stored) {
      try {
        setSrsData(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load SRS data:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('lingualoop-srs', JSON.stringify(srsData));
    }
  }, [srsData, isLoaded]);

  const getSRSItem = useCallback((phraseId: string): SRSItem => {
    return srsData[phraseId] || {
      phraseId,
      easeFactor: DEFAULT_EASE_FACTOR,
      interval: 0,
      repetitions: 0,
      lastReview: 0,
      nextReview: 0,
    };
  }, [srsData]);

  const updateSRS = useCallback((phraseId: string, quality: number) => {
    // Quality: 0-5 (0=forgot, 5=perfect)
    const item = getSRSItem(phraseId);
    const now = Date.now();

    let newEaseFactor = item.easeFactor;
    let newInterval = item.interval;
    let newRepetitions = item.repetitions;

    if (quality >= 3) {
      // Correct response
      if (item.repetitions === 0) {
        newInterval = 1; // 1 day
      } else if (item.repetitions === 1) {
        newInterval = 6; // 6 days
      } else {
        newInterval = Math.round(item.interval * item.easeFactor);
      }
      newRepetitions = item.repetitions + 1;
      newEaseFactor = item.easeFactor + (0.1 - (5 - quality) * EASE_FACTOR_CHANGE);
    } else {
      // Incorrect response
      newRepetitions = 0;
      newInterval = 1;
      newEaseFactor = Math.max(MIN_EASE_FACTOR, item.easeFactor - 0.2);
    }

    const nextReview = now + newInterval * 24 * 60 * 60 * 1000;

    setSrsData(prev => ({
      ...prev,
      [phraseId]: {
        phraseId,
        easeFactor: newEaseFactor,
        interval: newInterval,
        repetitions: newRepetitions,
        lastReview: now,
        nextReview,
      },
    }));
  }, [getSRSItem]);

  const getDuePhrases = useCallback((): Phrase[] => {
    const now = Date.now();
    return phrases.filter(phrase => {
      const item = getSRSItem(phrase.id);
      return item.nextReview <= now || item.repetitions === 0;
    });
  }, [phrases, getSRSItem]);

  const getPriorityPhrases = useCallback((): Phrase[] => {
    const due = getDuePhrases();
    if (due.length === 0) return phrases;

    // Sort by priority: due phrases first, then by ease factor (lower = harder)
    return [...phrases].sort((a, b) => {
      const aItem = getSRSItem(a.id);
      const bItem = getSRSItem(b.id);
      const aDue = aItem.nextReview <= Date.now() || aItem.repetitions === 0;
      const bDue = bItem.nextReview <= Date.now() || bItem.repetitions === 0;

      if (aDue && !bDue) return -1;
      if (!aDue && bDue) return 1;
      return aItem.easeFactor - bItem.easeFactor;
    });
  }, [phrases, getSRSItem, getDuePhrases]);

  const resetSRS = useCallback(() => {
    setSrsData({});
    localStorage.removeItem('lingualoop-srs');
  }, []);

  return {
    updateSRS,
    getDuePhrases,
    getPriorityPhrases,
    getSRSItem,
    resetSRS,
    isLoaded,
  };
}

