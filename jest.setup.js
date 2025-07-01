// jest.setup.js
global.import = {
  meta: {
    env: {
      VITE_API_BASE_URL: 'http://localhost:3000',
      MODE: 'test',
      DEV: false,
      PROD: false,
      SSR: false,
    },
  },
};
