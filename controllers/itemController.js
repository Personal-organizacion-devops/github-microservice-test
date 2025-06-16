const { faker } = require('@faker-js/faker');

const secrets = require('../libs/secrets');

secrets.injectSecrets();

let items = [];

API_PROVIDER_URL = process.env.API_PROVIDER_URL || 'localhost';

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
exports.getAllItems = (req, res) => {
  if (items.length === 0) {
    items = generateFakeItems(10);
  }
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
exports.getItem = (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  
  res.setHeader('Content-Type', 'application/json');
  item ? res.json({
    metadata: {
      provider: API_PROVIDER_URL
    },
    item
  }) : res.status(404).send('Item not found');
};

// Endpoint: POST /api/items
exports.createItem = (req, res) => {
    const newItem = { id: faker.string.uuid(), ...req.body };
    if (!newItem.name || !newItem.email || !newItem.registeredAt) {
        res.status(400).send('Missing required fields: name, email, or registeredAt');
        return;
    }
    items.push(newItem);
    
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({
    metadata: {
      provider: API_PROVIDER_URL
    },
    newItem
  });
};

// Endpoint: PUT /api/items/:id
exports.updateItem = (req, res) => {
  const index = items.findIndex(i => i.id === req.params.id);
  if (index !== -1) {
    items[index] = { ...items[index], ...req.body };
    
  res.setHeader('Content-Type', 'application/json');
    res.json(items[index]);

  res.setHeader('Content-Type', 'application/json');  
} else res.status(404).send('Item not found');
};

// Endpoint: DELETE /api/items/:id
exports.deleteItem = (req, res) => {
  const initialLength = items.length;
  items = items.filter(i => i.id !== req.params.id);
  const deleted = items.length < initialLength;

  
  res.setHeader('Content-Type', 'application/json');
  res.status(deleted ? 204 : 404).send();
};
