import { useCallback, useEffect, useState } from 'react';

// light / dark are explicit choices; auto follows the system setting.
export type ThemeChoice = 'light' | 'dark' | 'auto';
export type Theme = 'light' | 'dark';

// The same key and logic as the inline script in public/index.html,
// which sets the theme before React to avoid a flash.
export const THEME_STORAGE_KEY = 'pm-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

export const NEXT_THEME: Record<ThemeChoice, ThemeChoice> = { light: 'dark', dark: 'auto', auto: 'light' };

// Browser bar color: the same navy as public/index.html's theme-color metas.
const THEME_COLORS: Record<Theme, string> = { light: '#0B1E3A', dark: '#07111F' };

export const readStoredTheme = (): ThemeChoice => {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : 'auto';
  } catch {
    return 'auto';
  }
};

const darkQuery = (): MediaQueryList | null =>
  typeof window.matchMedia === 'function' ? window.matchMedia(DARK_QUERY) : null;

export const resolveTheme = (choice: ThemeChoice): Theme =>
  choice === 'auto' ? (darkQuery()?.matches ? 'dark' : 'light') : choice;

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-bs-theme', theme);
};

// An explicit choice paints every theme-color meta; auto gives each meta its own
// color back, so the media="(prefers-color-scheme: dark)" variant works again.
const syncThemeColor = (choice: ThemeChoice) => {
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    const own = meta.getAttribute('media')?.includes('dark') ? THEME_COLORS.dark : THEME_COLORS.light;
    meta.setAttribute('content', choice === 'auto' ? own : THEME_COLORS[choice]);
  });
};

export const useTheme = () => {
  const [choice, setChoice] = useState<ThemeChoice>(readStoredTheme);

  useEffect(() => {
    applyTheme(resolveTheme(choice));
    syncThemeColor(choice);
    if (choice !== 'auto') return undefined;

    const query = darkQuery();
    if (!query) return undefined;
    const onChange = (event: MediaQueryListEvent) => applyTheme(event.matches ? 'dark' : 'light');
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', onChange);
      return () => query.removeEventListener('change', onChange);
    }
    // Safari < 14
    query.addListener(onChange);
    return () => query.removeListener(onChange);
  }, [choice]);

  // A choice made in another tab applies here too.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY || event.key === null) setChoice(readStoredTheme());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setTheme = useCallback((next: ThemeChoice) => {
    // Without storage (private mode, blocked site data) the theme still changes
    // on the page, it just is not remembered.
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* not saved */
    }
    setChoice(next);
  }, []);

  const cycleTheme = useCallback(() => setTheme(NEXT_THEME[choice]), [choice, setTheme]);

  return { theme: choice, setTheme, cycleTheme };
};
