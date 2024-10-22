const express = require('express');
const supertest = require('supertest');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('../database');
const animalsRouter = require('../routes/allAnimals');

jest.mock('../database');

const app = express();

// Set up a mock session
// app.use(
//   session({
//     secret: 'test-secret',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       maxAge: 60000,
//     },
//   })
// );

app.use(bodyParser.json());

// Use the mock session in all routes
app.use((req, res, next) => {
  req.session = {
    userType: 'shelter',
    userId: 1,
    username: 'testShelter',
  };
  next();
});

app.use('/allAnimals', animalsRouter);

describe('Animal Routes', () => {
  describe('GET /allAnimals', () => {
    it('should return all animal info', async () => {
      const response = await supertest(app).get('/allAnimals');
      expect(response.status).toBe(200);
    });
  });

  // describe('POST /allAnimals/addPet', () => {
    // it('should add a new pet and create a new application', async () => {
    //   // Mock the database execute results for adding a pet and creating an application
    //   const mockDbResultPet = { affectedRows: 1, insertId: 3 };
    //   const mockDbResultApplication = { affectedRows: 1 };

    //   db.execute.mockResolvedValueOnce([mockDbResultPet]).mockResolvedValueOnce([mockDbResultApplication]);

    //   const newPet = {
    //     animalname: 'NewDog',
    //     species: 'Canine',
    //     breed: 'Golden Retriever',
    //     gender: 'Male',
    //     age: 2,
    //     comment: 'Friendly dog',
    //     color: 'Golden',
    //   };

    //   const response = await supertest(app).post('/allAnimals/addPet').send(newPet);

    //   expect(response.status).toBe(200);
    // });

  //   it('should handle errors when adding a pet', async () => {
  //     // Mock an error when adding a pet
  //     const mockError = new Error('Failed to add pet');
  //     db.execute.mockRejectedValueOnce(mockError);

  //     const newPet = {
  //       animalname: 'NewDog',
  //       species: 'Canine',
  //       breed: 'Golden Retriever',
  //       gender: 'Male',
  //       age: 2,
  //       comment: 'Friendly dog',
  //       color: 'Golden',
  //     };

  //     const response = await supertest(app).post('/allAnimals/addPet').send(newPet);

  //     expect(response.status).toBe(400);
  //   });
  // });

});



// // animalRoutes.test.js

// //const request = require('supertest');
// const express = require('express');
// const session = require('express-session');
// const bodyParser = require('body-parser');

// // Import your router
// const animalRoutes = require('../routes/allAnimals.js');

// const app = express();

// // Use session middleware for testing
// app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: true }));
// app.use(bodyParser.json());
// app.use(animalRoutes);

// describe('Animal Routes', () => {
//   describe('GET /allAnimals', () => {
//     it('should return a list of animals', async () => {
//       const response = await request(app).get('/');
//       expect(response.status).toBe(200);
//       // Add more expectations based on your route's behavior
//     });
//   });

//   // describe('POST /addPet', () => {
//   //   it('should add a pet if shelter is logged in', async () => {
//   //     // Mock session data for a logged-in shelter
//   //     const loggedInSession = { userType: 'shelter', userId: 1, username: 'testShelter' };
//   //     const response = await request(app)
//   //       .post('/addPet')
//   //       .set('Cookie', [`connect.sid=s%3A${encodeURIComponent(JSON.stringify(loggedInSession))}`])
//   //       .send({ 
//   //         "animalname": "Jest Testing",
//   //         "species": "dog",
//   //         "breed": "Chihuahua",
//   //         "gender": "female",
//   //         "age": 2,
//   //         "comment": "small",
//   //         "color": "black"  
//   //       });
      
//   //     expect(response.status).toBe(200);
//   //     // Add more expectations based on your route's behavior
//   //   });

//   //   it('should return 401 if shelter is not logged in', async () => {
//   //     const response = await request(app).post('/addPet').send({ /* your request body here */ });
//   //     expect(response.status).toBe(401);
//   //     // Add more expectations based on your route's behavior
//   //   });
//   // });

//   // Add more tests for other routes as needed
// });
