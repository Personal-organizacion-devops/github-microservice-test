const request = require('supertest');
const app = require('../app'); // Asegúrate de que `app.js` esté exportando tu aplicación Express

describe('Item API', () => {
  // Resetear los items antes de cada prueba
  beforeEach(() => {
    global.items = []; // Limpia el array de items antes de cada prueba
  });

  // Prueba GET /api/items
  it('should get all items', async () => {
    const response = await request(app).get('/api/items').expect(200);
    
    // Si no hay datos, verifica que sea un array vacío
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Prueba GET /api/items/:id
  it('should get a single item by ID', async () => {
    // Creamos un item falso para asegurarnos de que está disponible
    const newItem = { name: 'JohnDoe', email: 'john.doe@example.com', registeredAt: '2025-05-18T12:00:00Z' };
    const createResponse = await request(app).post('/api/items').send(newItem).expect(201);
    
    const itemId = createResponse.body.id;

    // Ahora obtenemos el item creado
    const response = await request(app).get(`/api/items/${itemId}`).expect(200);
    
    expect(response.body).toHaveProperty('id', itemId);
    expect(response.body).toHaveProperty('name', newItem.name);
    expect(response.body).toHaveProperty('email', newItem.email);
  });

  // Prueba POST /api/items
  it('should create a new item', async () => {
    const newItem = { name: 'JaneDoe', email: 'jane.doe@example.com', registeredAt: '2025-05-18T12:00:00Z' };
    
    const response = await request(app)
      .post('/api/items')
      .send(newItem)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.email).toBe(newItem.email);
  });

  // Prueba PUT /api/items/:id
  it('should update an existing item', async () => {
    const newItem = { name: 'ItemToUpdate', email: 'item.update@example.com', registeredAt: '2025-05-18T12:00:00Z' };
    const createResponse = await request(app).post('/api/items').send(newItem).expect(201);

    const itemId = createResponse.body.id;
    
    // Actualiza el item creado
    const updatedItem = { name: 'UpdatedItem', email: 'updated.item@example.com' };
    const response = await request(app)
      .put(`/api/items/${itemId}`)
      .send(updatedItem)
      .expect(200);
    
    expect(response.body.name).toBe(updatedItem.name);
    expect(response.body.email).toBe(updatedItem.email);
  });

  // Prueba DELETE /api/items/:id
  it('should delete an item', async () => {
    const newItem = { name: 'ItemToDelete', email: 'item.delete@example.com', registeredAt: '2025-05-18T12:00:00Z' };
    const createResponse = await request(app).post('/api/items').send(newItem).expect(201);

    const itemId = createResponse.body.id;
    
    // Elimina el item creado
    await request(app).delete(`/api/items/${itemId}`).expect(204);

  });
});
