import { useState, useEffect } from 'preact/hooks';
import { ListenMode, SpeakMode, QuizMode, Dashboard, Settings } from './pages';
import { LanguageSelector, BedModeToggle, StatsCard } from './components';
import { useSettings, useStats } from './hooks';
import type { LanguageCode } from './data';

type Mode = 'listen' | 'speak' | 'quiz' | 'dashboard' | 'settings';

export function App() {
  const [mode, setMode] = useState<Mode>('listen');
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageCode[]>(['de', 'fr', 'es', 'ru']);
  const { settings, updateSetting } = useSettings();
  const { stats, startSession, endSession } = useStats();
  const [autoPlay, setAutoPlay] = useState(true);
  const [interval, setInterval] = useState(5000);

  useEffect(() => {
    startSession();
    return () => endSession();
  }, []);

  useEffect(() => {
    // Apply bed mode styles from settings
    if (settings.bedMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-dark-bg');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-dark-bg');
    }
  }, [settings.bedMode]);

  const toggleLanguage = (lang: LanguageCode) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) 
        ? prev.filter(l => l !== lang)
        : [...prev, lang]
    );
  };

  return (
    <div className={`min-h-screen ${bedMode ? 'bg-dark-bg text-white' : 'bg-gray-900 text-white'} transition-colors`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className={`font-bold mb-4 ${bedMode ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl'}`}>
            🗣️ LinguaLoop
          </h1>
          <p className={`text-gray-400 ${bedMode ? 'text-2xl' : 'text-lg'}`}>
            Learn German, French, Spanish & Russian — hands-free, eyes-closed
          </p>
        </header>

        {/* Quick Stats */}
        {mode !== 'dashboard' && mode !== 'settings' && (
          <div className="max-w-4xl mx-auto mb-4">
            <StatsCard stats={stats} bedMode={settings.bedMode} />
          </div>
        )}

        {/* Controls */}
        <div className={`max-w-4xl mx-auto mb-8 ${settings.bedMode ? 'space-y-6' : 'space-y-4'}`}>
          {/* Mode Selector */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setMode('listen')}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all
                ${mode === 'listen' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-dark-surface text-gray-300 hover:bg-dark-accent'
                }
                ${settings.bedMode ? 'text-xl' : ''}
              `}
            >
              🎧 Listen
            </button>
            <button
              onClick={() => setMode('speak')}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all
                ${mode === 'speak' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-dark-surface text-gray-300 hover:bg-dark-accent'
                }
                ${settings.bedMode ? 'text-xl' : ''}
              `}
            >
              🗣️ Speak
            </button>
            <button
              onClick={() => setMode('quiz')}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all
                ${mode === 'quiz' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-dark-surface text-gray-300 hover:bg-dark-accent'
                }
                ${settings.bedMode ? 'text-xl' : ''}
              `}
            >
              🧠 Quiz
            </button>
            <button
              onClick={() => setMode('dashboard')}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all
                ${mode === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-dark-surface text-gray-300 hover:bg-dark-accent'
                }
                ${settings.bedMode ? 'text-xl' : ''}
              `}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setMode('settings')}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all
                ${mode === 'settings' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-dark-surface text-gray-300 hover:bg-dark-accent'
                }
                ${settings.bedMode ? 'text-xl' : ''}
              `}
            >
              ⚙️ Settings
            </button>
          </div>

          {/* Language Selector */}
          {mode !== 'dashboard' && mode !== 'settings' && (
            <LanguageSelector
              selectedLanguages={selectedLanguages}
              onToggle={toggleLanguage}
              bedMode={settings.bedMode}
            />
          )}

          {/* Quick Settings */}
          {mode !== 'dashboard' && mode !== 'settings' && (
            <div className="flex flex-wrap justify-center gap-4">
              <BedModeToggle 
                enabled={settings.bedMode} 
                onToggle={() => updateSetting('bedMode', !settings.bedMode)} 
              />
              
              {mode === 'listen' && (
                <>
                  <button
                    onClick={() => setAutoPlay(!autoPlay)}
                    className={`
                      px-4 py-2 rounded-lg font-semibold transition-all
                      ${autoPlay 
                        ? 'bg-green-600 text-white' 
                        : 'bg-dark-surface text-gray-300 hover:bg-dark-accent'
                      }
                      ${settings.bedMode ? 'text-xl' : ''}
                    `}
                  >
                    {autoPlay ? '▶️ Auto-play ON' : '⏸️ Auto-play OFF'}
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <label className={settings.bedMode ? 'text-xl' : ''}>Interval:</label>
                    <select
                      value={interval}
                      onChange={(e) => setInterval(Number((e.target as HTMLSelectElement).value))}
                      className={`
                        px-3 py-2 rounded-lg bg-dark-surface text-white
                        ${settings.bedMode ? 'text-xl' : ''}
                      `}
                    >
                      <option value="3000">3s</option>
                      <option value="5000">5s</option>
                      <option value="7000">7s</option>
                      <option value="10000">10s</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {mode === 'listen' && (
            <ListenMode
              selectedLanguages={selectedLanguages}
              bedMode={settings.bedMode}
              autoPlay={autoPlay}
              interval={interval}
            />
          )}
          {mode === 'speak' && (
            <SpeakMode
              selectedLanguages={selectedLanguages}
              bedMode={settings.bedMode}
            />
          )}
          {mode === 'quiz' && (
            <QuizMode
              selectedLanguages={selectedLanguages}
              bedMode={settings.bedMode}
            />
          )}
          {mode === 'dashboard' && (
            <Dashboard bedMode={settings.bedMode} />
          )}
          {mode === 'settings' && (
            <Settings bedMode={settings.bedMode} />
          )}
        </main>

        {/* Footer */}
        <footer className={`text-center mt-12 text-gray-500 ${bedMode ? 'text-xl' : ''}`}>
          <p>Built with ❤️ by Mehmet T. AKALIN</p>
        </footer>
      </div>
    </div>
  );
}

