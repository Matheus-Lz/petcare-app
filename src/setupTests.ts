import '@testing-library/jest-dom';

const realError = console.error;
const realWarn = console.warn;

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation((...args) => {
    const msg = args.join(' ');
    if (/React Router Future Flag Warning/.test(msg)) return;
    realWarn(...args);
  });

  jest.spyOn(console, 'error').mockImplementation((...args) => {
    const msg = args.join(' ');
    if (/Warning: .*act\(...\)/.test(msg)) return;
    realError(...args);
  });
});

afterAll(() => {
  (console.warn as jest.Mock).mockRestore?.();
  (console.error as jest.Mock).mockRestore?.();
});

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
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

if (!("ResizeObserver" in window)) {
  (window as any).ResizeObserver = ResizeObserverMock as any;
}

jest.setTimeout(20000);
