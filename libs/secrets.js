const AWS = require('aws-sdk');

let secretsLoaded = false;

async function injectSecrets() {
  if (secretsLoaded) return;

  const isRunningInLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;
  const REGION_NAME = process.env.AWS_REGION; // Cambia a tu región preferida
  const SECRET_NAME = process.env.SECRET_NAME; // Nombre del secreto en AWS Secrets Manager

  if (!isRunningInLambda) {
    // En local, simplemente usa el archivo .env
    require('dotenv').config();
    console.log('[INFO] Ejecutando en local. Variables de entorno cargadas desde .env.');
    secretsLoaded = true;
    return;
  }

  console.log('[INFO] Ejecutando en AWS Lambda. Obteniendo secretos desde Secrets Manager...');

  const client = new AWS.SecretsManager({ region: REGION_NAME });
  const secretValue = await client.getSecretValue({ SecretId: SECRET_NAME }).promise();

  let secrets = {};
  if ('SecretString' in secretValue) {
    secrets = JSON.parse(secretValue.SecretString);
  } else {
    secrets = JSON.parse(Buffer.from(secretValue.SecretBinary, 'base64').toString('utf8'));
  }

  // Cargar secretos directamente en process.env
  for (const [key, value] of Object.entries(secrets)) {
    process.env[key] = value;
  }

  secretsLoaded = true;
  console.log('[INFO] Secretos inyectados en process.env.');
}

module.exports = { injectSecrets };
