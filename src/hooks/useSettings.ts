import { useState, useEffect, useCallback } from 'preact/hooks';

export interface AppSettings {
  playbackSpeed: number;
  autoPlay: boolean;
  showTranslations: boolean;
  bedMode: boolean;
  theme: 'dark' | 'light' | 'auto';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  defaultLanguages: string[];
}

const DEFAULT_SETTINGS: AppSettings = {
  playbackSpeed: 1.0,
  autoPlay: true,
  showTranslations: true,
  bedMode: false,
  theme: 'dark',
  soundEnabled: true,
  notificationsEnabled: true,
  defaultLanguages: ['de', 'fr', 'es', 'ru'],
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('lingualoop-settings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('lingualoop-settings', JSON.stringify(settings));
      
      // Apply theme
      if (settings.theme === 'dark' || (settings.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('bg-dark-bg');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('bg-dark-bg');
      }
    }
  }, [settings, isLoaded]);

  const updateSetting = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('lingualoop-settings');
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings,
    isLoaded,
  };
}

