const AWS = require('aws-sdk');

let secretsLoaded = false;

async function injectSecrets() {
    if (secretsLoaded) return;

    const isRunningInLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;
    const REGION_NAME = process.env.REGION;
    const SECRET_NAME = process.env.SECRET_NAME;

    if (!isRunningInLambda) {
        await import('dotenv').then(dotenv => dotenv.config());
        console.log('[INFO] Ejecutando en local. Variables de entorno cargadas desde .env.');
        secretsLoaded = true;
        return;
    }

    if (!REGION_NAME || !SECRET_NAME) {
        console.error('[ERROR] REGION or SECRET_NAME environment variable is missing.');
        throw new Error('Missing REGION or SECRET_NAME environment variable');
    }

    try {
        console.log('[INFO] Ejecutando en AWS Lambda. Obteniendo secretos desde Secrets Manager...');
        const client = new AWS.SecretsManager({ region: REGION_NAME });
        const secretValue = await client.getSecretValue({ SecretId: SECRET_NAME }).promise();

        let secrets = {};
        if ('SecretString' in secretValue) {
            secrets = JSON.parse(secretValue.SecretString);
        } else {
            secrets = JSON.parse(Buffer.from(secretValue.SecretBinary, 'base64').toString('utf8'));
        }

        for (const [key, value] of Object.entries(secrets)) {
            process.env[key] = value;
        }

        secretsLoaded = true;
        console.log('[INFO] Secretos inyectados en process.env.');
    } catch (err) {
        console.error('[ERROR] Error obteniendo secretos:', err);
        throw err; // Let Lambda know initialization failed
    }
}

module.exports = { injectSecrets };
