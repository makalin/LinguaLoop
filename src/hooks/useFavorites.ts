import { useState, useEffect, useCallback } from 'preact/hooks';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('lingualoop-favorites');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavorites(new Set(parsed));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('lingualoop-favorites', JSON.stringify(Array.from(favorites)));
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = useCallback((phraseId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(phraseId)) {
        newSet.delete(phraseId);
      } else {
        newSet.add(phraseId);
      }
      return newSet;
    });
  }, []);

  const isFavorite = useCallback((phraseId: string) => {
    return favorites.has(phraseId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites(new Set());
    localStorage.removeItem('lingualoop-favorites');
  }, []);

  return {
    favorites: Array.from(favorites),
    toggleFavorite,
    isFavorite,
    clearFavorites,
    isLoaded,
  };
}

