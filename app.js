const express = require('express');
const bodyParser = require('body-parser');
const { injectSecrets } = require('./libs/secrets');
const { getAllItems, getItem, createItem, updateItem, deleteItem } = require('./controllers/itemController');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

async function startApp() {
  await injectSecrets();

  app.use(bodyParser.json());

  app.get('/api/items', getAllItems);
  app.get('/api/items/:id', getItem);
  app.post('/api/items', createItem);
  app.put('/api/items/:id', updateItem);
  app.delete('/api/items/:id', deleteItem);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 80;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
}

startApp();

module.exports = app;
