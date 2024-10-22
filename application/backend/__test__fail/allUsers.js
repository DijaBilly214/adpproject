const express = require('express');
const supertest = require('supertest');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('../database');
const usersRouter = require('../routes/allUsers');
const bcrypt = require('bcrypt');
// const { describe } = require('node:test');

const app = express();
app.use(bodyParser.json());

// Set up a mock session
app.use(
  session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000,
    },
  })
);

// Use the mock session in all routes
app.use((req, res, next) => {
  req.session = {
    userType: 'shelter',
    userId: 1,
    username: 'testShelter',
    secure: false,
    save: jest.fn(),
    touch: jest.fn(),
  };
  next();
});

app.use('/allusers', usersRouter);

// Mock the bcrypt.compare function
jest.mock('bcrypt');
bcrypt.compare.mockResolvedValue(true);  // You can change this based on your test case

describe('Users Routes', () => {

  describe('POST /allUsers', () => {
    const mockDbResult = [
      [
        {
          id: 1,
          username: 'testUser',
          password: '$2b$10$hash',  // This is a bcrypt hashed password
        }
      ],
      [] 
    ];

    it('should NOT authenticate a non user and return 401', async () => {
      // Mock the database query result
      
      db.query.mockImplementation(() => Promise.reject("wrong login type, should be user"));

      const response = await supertest(app)
        .post('/allusers/normal_login')
        .send({
          type: 'shelter',
          username: 'testUser',
          password: 'testPassword',  // Provide a password for testing
        });

      // Add your assertions based on the expected behavior
      expect(response.status).toBe(401);
      expect(response.body.message).toContain('wrong login type, should be user');
    });

    it('should authenticate a user and return 200', async () => {
      // Mock the database query result
      db.query.mockResolvedValue([mockDbResult]);

      const response = await supertest(app)
        .post('/allusers/normal_login')
        .send({
          type: 'user',
          username: 'testUser',
          password: 'testPassword',  // Provide a password for testing
        });

      // Add your assertions based on the expected behavior
      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Hi testUser, you are now logged in.');
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
