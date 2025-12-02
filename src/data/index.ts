import dePhrases from './de.json';
import frPhrases from './fr.json';
import esPhrases from './es.json';
import ruPhrases from './ru.json';
import enPhrases from './en.json';

export interface Phrase {
  id: string;
  text: string;
  translation: string;
  language: string;
}

export type LanguageCode = 'de' | 'fr' | 'es' | 'ru' | 'en';

export const phraseDecks: Record<LanguageCode, Phrase[]> = {
  de: dePhrases,
  fr: frPhrases,
  es: esPhrases,
  ru: ruPhrases,
  en: enPhrases,
};

export const languageNames: Record<LanguageCode, string> = {
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  ru: 'Russian',
  en: 'English',
};

export function getAllPhrases(): Phrase[] {
  return Object.values(phraseDecks).flat();
}

export function getPhrasesByLanguage(lang: LanguageCode): Phrase[] {
  return phraseDecks[lang] || [];
}

