const serverlessExpress = require('@vendia/serverless-express');
const app = require('./app');
const { injectSecrets } = require('./libs/secrets');

let server;
let secretsInjected = false;

exports.handler = async (event, context) => {
  if (!secretsInjected) {
    await injectSecrets();
    secretsInjected = true;
    server = serverlessExpress({ app });
  }

  return server(event, context);
};
