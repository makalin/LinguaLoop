import { JSX } from 'preact';
import { useSettings } from '../hooks/useSettings';
import { useStats } from '../hooks/useStats';
import { useFavorites } from '../hooks/useFavorites';
import { exportToJSON, exportToAnki, exportToCSV, downloadFile } from '../utils/export';
import { getAllPhrases } from '../data';

interface SettingsProps {
  bedMode: boolean;
}

export function Settings({ bedMode }: SettingsProps): JSX.Element {
  const { settings, updateSetting, resetSettings } = useSettings();
  const { stats, resetStats, setDailyGoal } = useStats();
  const { clearFavorites } = useFavorites();
  const phrases = getAllPhrases();
  const srsData = JSON.parse(localStorage.getItem('lingualoop-srs') || '{}');

  const handleExport = (format: 'json' | 'anki' | 'csv') => {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      srsData,
      stats,
      favorites: JSON.parse(localStorage.getItem('lingualoop-favorites') || '[]'),
      settings,
      phrases,
    };

    switch (format) {
      case 'json':
        downloadFile(
          exportToJSON(data),
          `lingualoop-export-${Date.now()}.json`,
          'application/json'
        );
        break;
      case 'anki':
        downloadFile(
          exportToAnki(phrases, srsData),
          `lingualoop-anki-${Date.now()}.txt`,
          'text/plain'
        );
        break;
      case 'csv':
        downloadFile(
          exportToCSV(phrases),
          `lingualoop-phrases-${Date.now()}.csv`,
          'text/csv'
        );
        break;
    }
  };

  const handleImport = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const data = JSON.parse(content);
        if (data.srsData) localStorage.setItem('lingualoop-srs', JSON.stringify(data.srsData));
        if (data.stats) localStorage.setItem('lingualoop-stats', JSON.stringify(data.stats));
        if (data.favorites) localStorage.setItem('lingualoop-favorites', JSON.stringify(data.favorites));
        if (data.settings) localStorage.setItem('lingualoop-settings', JSON.stringify(data.settings));
        alert('Data imported successfully! Please refresh the page.');
      } catch (err) {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`w-full ${bedMode ? 'max-w-4xl' : 'max-w-2xl'} mx-auto space-y-6`}>
      <div className={`bg-dark-surface rounded-lg p-6 ${bedMode ? 'text-2xl' : ''}`}>
        <h2 className={`font-bold mb-6 ${bedMode ? 'text-4xl' : 'text-2xl'}`}>⚙️ Settings</h2>

        <div className="space-y-6">
          {/* Playback Speed */}
          <div>
            <label className={`block mb-2 ${bedMode ? 'text-2xl' : ''}`}>
              Playback Speed: {settings.playbackSpeed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.playbackSpeed}
              onInput={(e) => updateSetting('playbackSpeed', parseFloat((e.target as HTMLInputElement).value))}
              className="w-full"
            />
          </div>

          {/* Daily Goal */}
          <div>
            <label className={`block mb-2 ${bedMode ? 'text-2xl' : ''}`}>
              Daily Goal: {stats.dailyGoal} phrases
            </label>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={stats.dailyGoal}
              onInput={(e) => setDailyGoal(parseInt((e.target as HTMLInputElement).value))}
              className="w-full"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoPlay}
                onChange={(e) => updateSetting('autoPlay', e.currentTarget.checked)}
                className="w-5 h-5"
              />
              <span className={bedMode ? 'text-xl' : ''}>Auto-play phrases</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showTranslations}
                onChange={(e) => updateSetting('showTranslations', e.currentTarget.checked)}
                className="w-5 h-5"
              />
              <span className={bedMode ? 'text-xl' : ''}>Show translations by default</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSetting('soundEnabled', e.currentTarget.checked)}
                className="w-5 h-5"
              />
              <span className={bedMode ? 'text-xl' : ''}>Sound effects</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationsEnabled}
                onChange={(e) => updateSetting('notificationsEnabled', e.currentTarget.checked)}
                className="w-5 h-5"
              />
              <span className={bedMode ? 'text-xl' : ''}>Daily reminders</span>
            </label>
          </div>

          {/* Export/Import */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className={`font-bold mb-4 ${bedMode ? 'text-3xl' : 'text-xl'}`}>💾 Data Management</h3>
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => handleExport('json')}
                className={`px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 ${bedMode ? 'text-xl' : ''}`}
              >
                Export JSON
              </button>
              <button
                onClick={() => handleExport('anki')}
                className={`px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 ${bedMode ? 'text-xl' : ''}`}
              >
                Export Anki
              </button>
              <button
                onClick={() => handleExport('csv')}
                className={`px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 ${bedMode ? 'text-xl' : ''}`}
              >
                Export CSV
              </button>
            </div>
            <div>
              <label className={`block mb-2 ${bedMode ? 'text-xl' : ''}`}>Import JSON:</label>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className={`px-4 py-2 rounded-lg bg-dark-accent ${bedMode ? 'text-xl' : ''}`}
              />
            </div>
          </div>

          {/* Reset Options */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className={`font-bold mb-4 text-red-400 ${bedMode ? 'text-3xl' : 'text-xl'}`}>
              ⚠️ Danger Zone
            </h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  if (confirm('Reset all statistics? This cannot be undone.')) {
                    resetStats();
                  }
                }}
                className={`px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 ${bedMode ? 'text-xl' : ''}`}
              >
                Reset Stats
              </button>
              <button
                onClick={() => {
                  if (confirm('Clear all favorites? This cannot be undone.')) {
                    clearFavorites();
                  }
                }}
                className={`px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 ${bedMode ? 'text-xl' : ''}`}
              >
                Clear Favorites
              </button>
              <button
                onClick={() => {
                  if (confirm('Reset all settings to default? This cannot be undone.')) {
                    resetSettings();
                  }
                }}
                className={`px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 ${bedMode ? 'text-xl' : ''}`}
              >
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

