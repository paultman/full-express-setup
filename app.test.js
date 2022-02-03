// app.test.js
const request = require('supertest');
const { MongoClient } = require('mongodb');
const appConfig = require('./config/app');
const logger = require('./lib/logger');
const app = require('./app');

describe('App Routes', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
    app.init(appConfig, logger, db);
  });

  afterAll(async () => {
    await connection.close();
  });

  test('Should respond with a 302 to index.html for a non-authenticated user', async () => {
    const response = await request(app).get('/home.html');
    expect(response.status).toEqual(302);
  });

  test('POST to /register should respond with a cookie and redirect to protected home route', async () => {
    const data = { email: 'test@gmail.com', password: 'test_Password' };
    await request(app)
      .post('/register')
      .send(data)
      .expect(302)
      .expect('Location', /home.html$/);
  });

  test('POST to /login with proper credentials should redirect to protected home route', async () => {
    const data = { email: 'test@gmail.com', password: 'test_Password' };
    await request(app)
      .post('/login')
      .send(data)
      .expect(302)
      .expect('Location', /home.html$/);
  });

  test('GET to /logout should eliminate auth state cookie and be unable to go to protected route', async () => {
    await request(app).get('/logout').expect(200);
    await request(app).get('/home.html').expect(302);
  });
});
