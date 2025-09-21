import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

class ResizeObserverMock {
  constructor(_cb?: any) {}
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

if (!('ResizeObserver' in window)) {
  (window as any).ResizeObserver = ResizeObserverMock as any;
}
