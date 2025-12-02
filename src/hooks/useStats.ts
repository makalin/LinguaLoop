import { useState, useEffect, useCallback } from 'preact/hooks';

export interface LearningStats {
  totalPhrasesStudied: number;
  totalSessions: number;
  totalTimeSpent: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  phrasesByLanguage: Record<string, number>;
  accuracyRate: number;
  dailyGoal: number;
  todayProgress: number;
}

const DEFAULT_STATS: LearningStats = {
  totalPhrasesStudied: 0,
  totalSessions: 0,
  totalTimeSpent: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  phrasesByLanguage: {},
  accuracyRate: 0,
  dailyGoal: 20,
  todayProgress: 0,
};

export function useStats() {
  const [stats, setStats] = useState<LearningStats>(DEFAULT_STATS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lingualoop-stats');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStats({ ...DEFAULT_STATS, ...parsed });
      } catch (e) {
        console.error('Failed to load stats:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('lingualoop-stats', JSON.stringify(stats));
    }
  }, [stats, isLoaded]);

  const startSession = useCallback(() => {
    setSessionStartTime(Date.now());
    setStats(prev => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
    }));
  }, []);

  const endSession = useCallback(() => {
    if (sessionStartTime) {
      const sessionDuration = Math.round((Date.now() - sessionStartTime) / 60000); // minutes
      setStats(prev => ({
        ...prev,
        totalTimeSpent: prev.totalTimeSpent + sessionDuration,
      }));
      setSessionStartTime(null);
    }
  }, [sessionStartTime]);

  const recordPhraseStudy = useCallback((phraseId: string, language: string, correct: boolean) => {
    const today = new Date().toDateString();
    const lastDate = stats.lastStudyDate ? new Date(stats.lastStudyDate).toDateString() : null;
    
    let newStreak = stats.currentStreak;
    let newTodayProgress = stats.todayProgress;
    
    if (lastDate !== today) {
      // New day
      if (lastDate && new Date(today).getTime() - new Date(lastDate).getTime() === 86400000) {
        // Consecutive day
        newStreak = stats.currentStreak + 1;
      } else if (lastDate) {
        // Streak broken
        newStreak = 1;
      } else {
        // First time
        newStreak = 1;
      }
      newTodayProgress = 0;
    } else {
      // Same day
      newTodayProgress = stats.todayProgress + 1;
    }

    setStats(prev => ({
      ...prev,
      totalPhrasesStudied: prev.totalPhrasesStudied + 1,
      currentStreak: newStreak,
      longestStreak: Math.max(prev.longestStreak, newStreak),
      lastStudyDate: today,
      todayProgress: newTodayProgress,
      phrasesByLanguage: {
        ...prev.phrasesByLanguage,
        [language]: (prev.phrasesByLanguage[language] || 0) + 1,
      },
    }));
  }, [stats]);

  const updateAccuracy = useCallback((correct: number, total: number) => {
    if (total === 0) return;
    const newAccuracy = (correct / total) * 100;
    setStats(prev => ({
      ...prev,
      accuracyRate: prev.accuracyRate === 0 
        ? newAccuracy 
        : (prev.accuracyRate + newAccuracy) / 2, // Moving average
    }));
  }, []);

  const setDailyGoal = useCallback((goal: number) => {
    setStats(prev => ({
      ...prev,
      dailyGoal: goal,
    }));
  }, []);

  const resetStats = useCallback(() => {
    setStats(DEFAULT_STATS);
    localStorage.removeItem('lingualoop-stats');
  }, []);

  return {
    stats,
    startSession,
    endSession,
    recordPhraseStudy,
    updateAccuracy,
    setDailyGoal,
    resetStats,
    isLoaded,
  };
}

