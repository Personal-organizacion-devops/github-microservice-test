const AWS = require('aws-sdk');

let cachedSecrets = null;

async function getSecrets() {
  if (cachedSecrets) return cachedSecrets;

  const REGION_NAME = process.env.REGION;
  const SECRET_NAME = process.env.SECRET_NAME;

  if (!REGION_NAME || !SECRET_NAME) {
    throw new Error('Faltan REGION o SECRET_NAME en las variables de entorno');
  }

  const client = new AWS.SecretsManager({ region: REGION_NAME });

  const secretValue = await client.getSecretValue({ SecretId: SECRET_NAME }).promise();

  let secrets;
  if ('SecretString' in secretValue) {
    secrets = JSON.parse(secretValue.SecretString);
  } else {
    secrets = JSON.parse(Buffer.from(secretValue.SecretBinary, 'base64').toString('utf-8'));
  }

  cachedSecrets = secrets;
  return secrets;
}

module.exports = { getSecrets };
