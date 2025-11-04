// jest.setup.js
// Setup file untuk konfigurasi global Jest

// Set environment variables untuk testing
process.env.NODE_ENV = 'test';
process.env.RSA_PASSPHRASE = 'test-passphrase-for-jest';
process.env.DATABASE_URL = 'mongodb://localhost:27017/test-db';

// Mock console methods untuk mengurangi noise di output test
global.console = {
  ...console,
  log: jest.fn(), // Mock console.log
  warn: jest.fn(), // Mock console.warn
  error: jest.fn(), // Keep console.error for debugging
};

// Set timeout untuk tests yang mungkin memerlukan waktu lebih lama
jest.setTimeout(10000);

// Mock Next.js server components jika diperlukan
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      status: init?.status || 200,
      json: async () => data,
      headers: {
        get: jest.fn((key) => null),
      },
    })),
    redirect: jest.fn((url) => {
      const urlObj = typeof url === 'string' ? { pathname: url } : url;
      const pathname = urlObj.pathname || url;
      return {
        status: 307,
        headers: {
          get: jest.fn((key) => {
            if (key === 'Location') {
              return pathname;
            }
            return null;
          }),
        },
      };
    }),
    next: jest.fn(() => ({
      status: 200,
      headers: {
        get: jest.fn((key) => null),
      },
    })),
  },
}));

