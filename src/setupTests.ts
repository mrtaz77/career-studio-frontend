import '@testing-library/jest-dom';

// default‐import style
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Mock import.meta for Jest environment using a more direct approach
// This will be used by the babel transform
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).import = {
  meta: {
    env: {
      VITE_API_BASE_URL: 'http://localhost:3000',
      MODE: 'test',
      DEV: 'false',
      PROD: 'false',
      SSR: 'false',
    },
  },
};
