// Jest setup file

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
    readText: jest.fn(),
  },
});

// Mock performance.now
global.performance = {
  now: jest.fn(() => Date.now()),
};

// Mock Blob
global.Blob = class Blob {
  constructor(parts) {
    this.size = parts ? parts.join('').length : 0;
  }
};
