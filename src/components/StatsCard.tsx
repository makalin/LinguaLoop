import { JSX } from 'preact';
import type { LearningStats } from '../hooks/useStats';

interface StatsCardProps {
  stats: LearningStats;
  bedMode?: boolean;
}

export function StatsCard({ stats, bedMode = false }: StatsCardProps): JSX.Element {
  const progressPercentage = stats.dailyGoal > 0 
    ? Math.min((stats.todayProgress / stats.dailyGoal) * 100, 100)
    : 0;

  return (
    <div className={`bg-dark-surface rounded-lg p-6 ${bedMode ? 'text-2xl' : ''}`}>
      <h3 className={`font-bold mb-4 ${bedMode ? 'text-3xl' : 'text-xl'}`}>📊 Your Progress</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <div className={`text-gray-400 ${bedMode ? 'text-xl' : 'text-sm'}`}>Streak</div>
          <div className={`font-bold ${bedMode ? 'text-3xl' : 'text-2xl'}`}>
            🔥 {stats.currentStreak}
          </div>
        </div>
        <div>
          <div className={`text-gray-400 ${bedMode ? 'text-xl' : 'text-sm'}`}>Studied</div>
          <div className={`font-bold ${bedMode ? 'text-3xl' : 'text-2xl'}`}>
            {stats.totalPhrasesStudied}
          </div>
        </div>
        <div>
          <div className={`text-gray-400 ${bedMode ? 'text-xl' : 'text-sm'}`}>Sessions</div>
          <div className={`font-bold ${bedMode ? 'text-3xl' : 'text-2xl'}`}>
            {stats.totalSessions}
          </div>
        </div>
        <div>
          <div className={`text-gray-400 ${bedMode ? 'text-xl' : 'text-sm'}`}>Accuracy</div>
          <div className={`font-bold ${bedMode ? 'text-3xl' : 'text-2xl'}`}>
            {stats.accuracyRate.toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className={bedMode ? 'text-xl' : ''}>Today's Goal</span>
          <span className={bedMode ? 'text-xl' : ''}>
            {stats.todayProgress} / {stats.dailyGoal}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {stats.lastStudyDate && (
        <div className={`text-gray-400 ${bedMode ? 'text-xl' : 'text-sm'}`}>
          Last studied: {new Date(stats.lastStudyDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

