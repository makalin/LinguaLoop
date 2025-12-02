import type { Phrase } from '../data';

export interface ExportData {
  version: string;
  exportDate: string;
  srsData: Record<string, any>;
  stats: any;
  favorites: string[];
  settings: any;
  phrases: Phrase[];
}

export function exportToJSON(data: ExportData): string {
  return JSON.stringify(data, null, 2);
}

export function exportToAnki(phrases: Phrase[], srsData: Record<string, any>): string {
  // Anki TSV format: Front, Back, Tags
  const lines = phrases.map(phrase => {
    const item = srsData[phrase.id];
    const tags = [
      phrase.language,
      item?.repetitions > 0 ? 'learned' : 'new',
      item?.easeFactor && item.easeFactor < 1.5 ? 'difficult' : '',
    ].filter(Boolean).join(' ');
    
    return `${phrase.text}\t${phrase.translation}\t${tags}`;
  });
  
  return lines.join('\n');
}

export function exportToCSV(phrases: Phrase[]): string {
  const headers = 'Language,Phrase,Translation';
  const lines = phrases.map(p => `${p.language},"${p.text}","${p.translation}"`);
  return [headers, ...lines].join('\n');
}

export function importFromJSON(jsonString: string): ExportData | null {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Failed to import:', e);
    return null;
  }
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

