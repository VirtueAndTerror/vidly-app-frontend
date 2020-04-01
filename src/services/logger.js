// import * as Sentry from '@sentry/browser';

// function init() {
//   Sentry.init({
//     dsn: 'https://14dfb1bdc52a4082ba3e84529724d701@sentry.io/5182222'
//   });
// }

function log(error) {
  console.error(error);
  // Sentry.captureException(error);
}

export default {
  // init,
  log
};
