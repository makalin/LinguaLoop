import { JSX } from 'preact';
import type { LanguageCode } from '../data';
import { languageNames } from '../data';

interface LanguageSelectorProps {
  selectedLanguages: LanguageCode[];
  onToggle: (lang: LanguageCode) => void;
  bedMode?: boolean;
}

export function LanguageSelector({
  selectedLanguages,
  onToggle,
  bedMode = false,
}: LanguageSelectorProps): JSX.Element {
  const languages: LanguageCode[] = ['de', 'fr', 'es', 'ru'];

  return (
    <div className={`flex flex-wrap gap-3 ${bedMode ? 'mb-8' : 'mb-4'}`}>
      {languages.map(lang => {
        const isSelected = selectedLanguages.includes(lang);
        return (
          <button
            key={lang}
            onClick={() => onToggle(lang)}
            className={`
              px-4 py-2 rounded-lg font-semibold transition-all
              ${isSelected 
                ? 'bg-blue-600 text-white' 
                : 'bg-dark-accent text-gray-300 hover:bg-dark-accent/80'
              }
              ${bedMode ? 'text-xl' : ''}
            `}
          >
            {languageNames[lang]}
          </button>
        );
      })}
    </div>
  );
}

