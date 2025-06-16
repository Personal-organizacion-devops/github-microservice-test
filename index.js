const serverlessExpress = require('@vendia/serverless-express');
const app = require('./app');
const { injectSecrets } = require('./libs/secrets');

let server;

const init = async () => {
  await injectSecrets();
  server = serverlessExpress({ app });
};

const initPromise = init();

exports.handler = async (event, context) => {
  await initPromise;
  return server(event, context);
};