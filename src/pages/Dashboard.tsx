import { JSX } from 'preact';
import { StatsCard } from '../components/StatsCard';
import { useStats } from '../hooks/useStats';
import { languageNames } from '../data';
import type { LanguageCode } from '../data';

interface DashboardProps {
  bedMode: boolean;
}

export function Dashboard({ bedMode }: DashboardProps): JSX.Element {
  const { stats } = useStats();

  const languageStats = Object.entries(stats.phrasesByLanguage)
    .map(([lang, count]) => ({
      language: languageNames[lang as LanguageCode] || lang,
      count: count as number,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className={`w-full ${bedMode ? 'max-w-5xl' : 'max-w-4xl'} mx-auto space-y-6`}>
      <StatsCard stats={stats} bedMode={bedMode} />

      {languageStats.length > 0 && (
        <div className={`bg-dark-surface rounded-lg p-6 ${bedMode ? 'text-2xl' : ''}`}>
          <h3 className={`font-bold mb-4 ${bedMode ? 'text-3xl' : 'text-xl'}`}>
            📈 By Language
          </h3>
          <div className="space-y-3">
            {languageStats.map(({ language, count }) => (
              <div key={language} className="flex items-center justify-between">
                <span className={bedMode ? 'text-xl' : ''}>{language}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(count / stats.totalPhrasesStudied) * 100}%`,
                      }}
                    />
                  </div>
                  <span className={`font-bold ${bedMode ? 'text-xl' : ''}`}>{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`bg-dark-surface rounded-lg p-6 ${bedMode ? 'text-2xl' : ''}`}>
        <h3 className={`font-bold mb-4 ${bedMode ? 'text-3xl' : 'text-xl'}`}>
          ⏱️ Time Spent
        </h3>
        <div className={`${bedMode ? 'text-3xl' : 'text-2xl'} font-bold`}>
          {Math.round(stats.totalTimeSpent)} minutes
        </div>
        <div className={`text-gray-400 mt-2 ${bedMode ? 'text-xl' : ''}`}>
          {Math.round(stats.totalTimeSpent / 60)} hours total
        </div>
      </div>

      {stats.longestStreak > 0 && (
        <div className={`bg-dark-surface rounded-lg p-6 ${bedMode ? 'text-2xl' : ''}`}>
          <h3 className={`font-bold mb-2 ${bedMode ? 'text-3xl' : 'text-xl'}`}>
            🏆 Achievements
          </h3>
          <div className="space-y-2">
            <div className={bedMode ? 'text-xl' : ''}>
              ✅ Longest Streak: {stats.longestStreak} days
            </div>
            {stats.totalPhrasesStudied >= 100 && (
              <div className={bedMode ? 'text-xl' : ''}>
                🎯 Studied 100+ phrases
              </div>
            )}
            {stats.totalPhrasesStudied >= 500 && (
              <div className={bedMode ? 'text-xl' : ''}>
                🌟 Studied 500+ phrases
              </div>
            )}
            {stats.accuracyRate >= 80 && (
              <div className={bedMode ? 'text-xl' : ''}>
                💯 80%+ accuracy
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

