// const serverlessExpress = require('@vendia/serverless-express');
// const app = require('./app');

// exports.handler = serverlessExpress({ app });

exports.handler = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify("Hello, World!"),
    };
};
