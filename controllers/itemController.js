// itemController.js

const { faker } = require('@faker-js/faker');
const { getSecrets } = require('../libs/secrets');

let items = [];

// Generar datos fake si está vacío
function generateFakeItems(count = 10) {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.internet.username(),
    email: faker.internet.email(),
    registeredAt: faker.date.past()
  }));
}

// Endpoint: GET /api/items
exports.getAllItems = async (req, res) => {
  if (items.length === 0) {
    items = generateFakeItems(10);
  }
  const secrets = await getSecrets();
  const API_PROVIDER_URL = secrets.API_PROVIDER_URL || 'localhost';

  res.status(200);
  res.setHeader('Content-Type', 'application/json');
  res.json({
    metadata: {
      provider: API_PROVIDER_URL
    },
    items
  });
};

// Endpoint: GET /api/items/:id
exports.getItem = async (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  const secrets = await getSecrets();
  const API_PROVIDER_URL = secrets.API_PROVIDER_URL || 'localhost';

  res.setHeader('Content-Type', 'application/json');
  item ? res.json({
    metadata: {
      provider: API_PROVIDER_URL
    },
    item
  }) : res.status(404).send('Item not found');
};

// Endpoint: POST /api/items
exports.createItem = async (req, res) => {
  const newItem = { id: faker.string.uuid(), ...req.body };
  if (!newItem.name || !newItem.email || !newItem.registeredAt) {
    res.status(400).send('Missing required fields: name, email, or registeredAt');
    return;
  }
  items.push(newItem);

  const secrets = await getSecrets();
  const API_PROVIDER_URL = secrets.API_PROVIDER_URL || 'localhost';

  res.setHeader('Content-Type', 'application/json');
  res.status(201).json({
    metadata: {
      provider: API_PROVIDER_URL
    },
    newItem
  });
};

// Endpoint: PUT /api/items/:id
exports.updateItem = async (req, res) => {
  const index = items.findIndex(i => i.id === req.params.id);
  if (index !== -1) {
    items[index] = { ...items[index], ...req.body };

    const secrets = await getSecrets();
    const API_PROVIDER_URL = secrets.API_PROVIDER_URL || 'localhost';

    res.setHeader('Content-Type', 'application/json');
    res.json({
      metadata: {
        provider: API_PROVIDER_URL
      },
      item: items[index]
    });
  } else {
    res.status(404).send('Item not found');
  }
};

// Endpoint: DELETE /api/items/:id
exports.deleteItem = async (req, res) => {
  const initialLength = items.length;
  items = items.filter(i => i.id !== req.params.id);
  const deleted = items.length < initialLength;

  res.setHeader('Content-Type', 'application/json');
  res.status(deleted ? 204 : 404).send();
};
