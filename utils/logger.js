/* eslint-disable no-console */
function getDate() {
  return new Date().toISOString();
}

module.exports = {
  log(message) {
    const date = getDate();
    console.log(`Log: ${date} *** ${message}`);
  },

  error(message, error) {
    const date = getDate();
    const errorMessage = error ? `\nMessage: ${error.message}` : '';
    console.error(`Error: ${date} *** ${message}${errorMessage}`);
    if (error && error.stack) {
      console.error(`Error stack: ${date} *** `);
      console.error(error.stack);
      const innerError = error.inner;
      if (innerError && innerError.stack) {
        console.error(`Inner error stack: ${date} *** `);
        console.error(innerError.stack);
      }
    }
  },

  warning(message) {
    const date = getDate();
    console.log(`Warning: ${date} *** ${message}`);
  },

  info(message) {
    const date = getDate();
    console.info(`Info: ${date} *** ${message}`);
  },

  trace(message) {
    const date = getDate();
    console.info(`Trace: ${date} *** ${message}`);
  },

  debug(message) {
    const date = getDate();
    console.info(`Debug: ${date} *** ${message}`);
  },
};
