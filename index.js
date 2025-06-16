const serverlessExpress = require('@vendia/serverless-express');
const app = require('./app');
const { injectSecrets } = require('./libs/secrets');

(async () => {
  await injectSecrets(); // Carga los secretos antes de iniciar el servidor
})();

exports.handler = serverlessExpress({ app });