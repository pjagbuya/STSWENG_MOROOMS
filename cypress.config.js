const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    experimentalSessionAndOrigin: true,
    defaultCommandTimeout: 30000,
    pageLoadTimeout: 30000,
  },
});
