const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 120000,
    requestTimeout: 60000,
    responseTimeout: 60000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
