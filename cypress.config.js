const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      KINDE_ISSUER_URL: 'https://adty.kinde.com',
      API_URL: 'http://localhost:3000/api',
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    chromeWebSecurity: false, // Untuk handle Kinde OAuth
  },
});