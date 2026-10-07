import React from 'react';
import fs from 'fs';
import path from 'path';
import { act, fireEvent, screen } from '@testing-library/react';
import Header from '../../components/header/header';
import { THEME_STORAGE_KEY } from '../../hooks/useTheme';
import { renderWithProviders } from './renderWithProviders';

jest.mock('../../services/api/auth/auth');

// A controllable prefers-color-scheme: dark.
const installSystemTheme = (dark: boolean) => {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const query = {
    matches: dark,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    addListener: (listener: (event: MediaQueryListEvent) => void) => listeners.add(listener),
    removeListener: (listener: (event: MediaQueryListEvent) => void) => listeners.delete(listener),
    dispatchEvent: () => false,
  };
  const original = window.matchMedia;
  window.matchMedia = jest.fn(() => query as unknown as MediaQueryList);
  return {
    setDark(value: boolean) {
      query.matches = value;
      act(() => listeners.forEach((listener) => listener({ matches: value } as MediaQueryListEvent)));
    },
    listenerCount: () => listeners.size,
    restore: () => { window.matchMedia = original; },
  };
};

// Blocks localStorage only; sessionStorage (used by auth) keeps working.
const blockLocalStorage = (method: 'getItem' | 'setItem') => {
  const original = Storage.prototype[method] as (...args: string[]) => string | null | void;
  return jest.spyOn(Storage.prototype, method).mockImplementation(function (this: Storage, ...args: string[]) {
    if (this === window.localStorage) throw new Error('blocked');
    return original.apply(this, args) as never;
  });
};

const htmlTheme = () => document.documentElement.getAttribute('data-bs-theme');
const toggle = () => screen.getByRole('button', { name: /^Тема:/ });

// Runs the inline script from public/index.html as the browser would before React.
const runInlineScript = () => {
  const html = fs.readFileSync(path.join(__dirname, '../../../public/index.html'), 'utf8');
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const script = doc.getElementById('pm-theme-init');
  if (!script?.textContent) throw new Error('no #pm-theme-init script in index.html');
  // eslint-disable-next-line no-new-func
  new Function(script.textContent)();
};

describe('Theme', () => {
  let system: ReturnType<typeof installSystemTheme> | null = null;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-bs-theme');
  });

  afterEach(() => {
    system?.restore();
    system = null;
    jest.restoreAllMocks();
  });

  test('first visit with a dark system: the inline script sets dark before React', () => {
    system = installSystemTheme(true);
    runInlineScript();
    expect(htmlTheme()).toBe('dark');
  });

  test('first visit with a light system: light', () => {
    system = installSystemTheme(false);
    runInlineScript();
    expect(htmlTheme()).toBe('light');
  });

  test('saved dark wins over a light system on reload (no white flash)', () => {
    system = installSystemTheme(false);
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    runInlineScript();
    expect(htmlTheme()).toBe('dark');
  });

  test.each(['auto', 'blue'])('the inline script follows the system for a stored %p', (stored) => {
    system = installSystemTheme(true);
    localStorage.setItem(THEME_STORAGE_KEY, stored);
    runInlineScript();
    expect(htmlTheme()).toBe('dark');
  });

  test('the inline script survives a throwing localStorage', () => {
    system = installSystemTheme(true);
    blockLocalStorage('getItem');
    runInlineScript();
    expect(htmlTheme()).toBe('dark');
  });

  test('the header has the toggle; clicks cycle light → dark → auto and save the choice', () => {
    system = installSystemTheme(true);
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    renderWithProviders(<Header />);

    expect(toggle()).toHaveAccessibleName('Тема: світла. Натисніть, щоб перемкнути на «темну»');
    expect(htmlTheme()).toBe('light');

    fireEvent.click(toggle());
    expect(toggle()).toHaveAccessibleName('Тема: темна. Натисніть, щоб перемкнути на «як у системі»');
    expect(htmlTheme()).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

    fireEvent.click(toggle());
    expect(toggle()).toHaveAccessibleName('Тема: як у системі. Натисніть, щоб перемкнути на «світлу»');
    expect(htmlTheme()).toBe('dark'); // the system is dark
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('auto');

    fireEvent.click(toggle());
    expect(toggle()).toHaveAccessibleName('Тема: світла. Натисніть, щоб перемкнути на «темну»');
    expect(htmlTheme()).toBe('light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  test('localStorage throws: the theme still changes on the page, just is not saved', () => {
    system = installSystemTheme(false);
    blockLocalStorage('getItem');
    const setItem = blockLocalStorage('setItem');
    renderWithProviders(<Header />);

    expect(toggle()).toHaveAccessibleName('Тема: як у системі. Натисніть, щоб перемкнути на «світлу»');
    expect(htmlTheme()).toBe('light');

    fireEvent.click(toggle());
    expect(toggle()).toHaveAccessibleName('Тема: світла. Натисніть, щоб перемкнути на «темну»');
    fireEvent.click(toggle());
    expect(toggle()).toHaveAccessibleName('Тема: темна. Натисніть, щоб перемкнути на «як у системі»');
    expect(htmlTheme()).toBe('dark');
    expect(setItem).toHaveBeenCalled();
  });

  test('«як у системі» follows a system change without reload', () => {
    system = installSystemTheme(false);
    renderWithProviders(<Header />);
    expect(htmlTheme()).toBe('light');

    system.setDark(true);
    expect(htmlTheme()).toBe('dark');
    system.setDark(false);
    expect(htmlTheme()).toBe('light');
  });

  test('an explicit choice ignores system changes', () => {
    system = installSystemTheme(false);
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    renderWithProviders(<Header />);
    expect(system.listenerCount()).toBe(0);

    system.setDark(true);
    expect(htmlTheme()).toBe('light');

    fireEvent.click(toggle()); // → dark
    system.setDark(false);
    expect(htmlTheme()).toBe('dark');
  });

  test('stored auto → click to light → a system change is ignored and nobody listens', () => {
    system = installSystemTheme(false);
    localStorage.setItem(THEME_STORAGE_KEY, 'auto');
    renderWithProviders(<Header />);
    expect(system.listenerCount()).toBe(1);

    fireEvent.click(toggle()); // auto → light
    expect(toggle()).toHaveAccessibleName(/^Тема: світла\./);
    expect(system.listenerCount()).toBe(0);

    system.setDark(true);
    expect(htmlTheme()).toBe('light');
  });

  test('unmounting the header in auto removes the system listener', () => {
    system = installSystemTheme(false);
    const { unmount } = renderWithProviders(<Header />);
    expect(system.listenerCount()).toBe(1);
    unmount();
    expect(system.listenerCount()).toBe(0);
  });

  test('a choice made in another tab applies here', () => {
    system = installSystemTheme(false);
    renderWithProviders(<Header />);
    expect(htmlTheme()).toBe('light');

    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    act(() => { window.dispatchEvent(new StorageEvent('storage', { key: THEME_STORAGE_KEY, newValue: 'dark' })); });
    expect(htmlTheme()).toBe('dark');
    expect(toggle()).toHaveAccessibleName(/^Тема: темна\./);
  });

  test('an explicit choice paints the theme-color metas; auto gives each its own color back', () => {
    system = installSystemTheme(false);
    document.head.innerHTML =
      '<meta name="theme-color" content="#07111F" media="(prefers-color-scheme: dark)">' +
      '<meta name="theme-color" content="#0B1E3A">';
    const colors = () =>
      Array.from(document.querySelectorAll('meta[name="theme-color"]')).map((m) => m.getAttribute('content'));
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    renderWithProviders(<Header />);
    expect(colors()).toEqual(['#07111F', '#07111F']);

    fireEvent.click(toggle()); // dark → auto
    expect(colors()).toEqual(['#07111F', '#0B1E3A']);
    fireEvent.click(toggle()); // auto → light
    expect(colors()).toEqual(['#0B1E3A', '#0B1E3A']);
    document.head.innerHTML = '';
  });
});
