// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom has no matchMedia; the theme hook reads prefers-color-scheme through it.
// A light system that never changes; theme tests install their own controllable mock.
if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// jsdom has no IntersectionObserver; the fundraising page hides its mobile action
// bar with one. This stub never fires on its own: tests drive it through
// `MockIntersectionObserver.instances` (or delete it to test the fallback).
export class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  readonly root = null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number> = [0];
  readonly targets = new Set<Element>();

  constructor(private readonly callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.rootMargin = options?.rootMargin ?? '0px';
    MockIntersectionObserver.instances.push(this);
  }

  observe(target: Element) { this.targets.add(target); }
  unobserve(target: Element) { this.targets.delete(target); }
  disconnect() { this.targets.clear(); }
  takeRecords(): IntersectionObserverEntry[] { return []; }

  // Reports every observed target with the given geometry.
  trigger(entry: Partial<IntersectionObserverEntry>) {
    const entries = Array.from(this.targets).map((target) => ({ target, ...entry }) as IntersectionObserverEntry);
    if (entries.length > 0) {
      this.callback(entries, this);
    }
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

afterEach(() => {
  MockIntersectionObserver.instances = [];
});
