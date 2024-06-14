const request = require('supertest');
const { app, start, stop } = require('../server');
const { token } = require('morgan');

// // Mocking the imported modules
// jest.mock('../__mocks__/config.js');
// jest.mock('../middleware/auth.js');
// jest.mock('../middleware/upload.js');
// jest.mock('../models/mvc_User');
// jest.mock('../controllers/user.js');
// jest.mock('../controllers/authenticate');

// // Mock implementations for the modules
// const auth = require('../middleware/auth.js');
// const userModel = require('../models/mvc_User');
// const User = require('../controllers/user.js');
// const authenticateController = require('../controllers/authenticate');

// // Mocking functions
// auth.mockImplementation((req, res, next) => next());
// User.mockImplementation(() => (req, res) => res.status(200).send("User route"));
// authenticateController.authenticate = jest.fn((req, res) => res.status(200).send("Authenticated"));

// describe('Express Server', () => {
//     let serverInstance;

//     beforeAll(async () => {
//         serverInstance = await start(); // Ensure the server is ready before running tests
//     }, 10000); // Timeout for the beforeAll hook

//     afterAll(async () => {
//         await stop(); // Ensure the server is closed after tests
//     }, 10000); // Timeout for the afterAll hook

//     it('should respond to /api/authenticate', async () => {
//         // const res = await request(authenticateController.authenticate)
//         //     .post('/api/authenticate')
//         //     .send({ username: 'test', password: 'test' });

//         // expect(res.statusCode).toEqual(200);
//         // expect(res.text).toBe('Authenticated');


//         serverInstance();
//     }, 10000); // Timeout for this specific test
// });


const mockUser = {
    password:"TestPassword",
    type:"WEB_APPLICATION",
    email:"Test@123.com",
    username:"testUser"
        };
describe('test mock', () => {
    it('create user with 200 status',()=>{
        return request(app)
        .post('/user')
        .send(mockUser)
        .expect('Content-Type', /json/)
        .then((res)=>{
            //  console.log('res',res);
            expect(res.statusCode).toEqual(200);
            
            expect(res.body.message).toBe('User created successfully.');
        })
    });
    it('create user with 400 status',()=>{
        return request(app)
        .post('/user')
        .send(mockUser)
        .expect('Content-Type', /json/)
        .then((res)=>{
            //  console.log('res',res);
            expect(res.statusCode).toEqual(400);
            
            // expect(res.body.message).toBe('User created successfully.');
        })
    });
    it('User does not exist. /api/authendicate ', () => {
        return request(app)
          .post('/api/authenticate')
          .send({ username: 'test', password: 'test' })
        //   .expect(res.statusCode).toEqual(200)

          .then((response) => {
            // console.log('responseresponse------------------------',response);
            var parsedTest = JSON.parse(response.text);
            expect(response.statusCode).toEqual(200);
            expect(parsedTest.status).toEqual(404);
            expect(parsedTest.message).toBe('User does not exist.');
          });
        });
        it('/api/authendicate  200', () => {
            return request(app)
              .post('/api/authenticate')
              .send({ username: mockUser.username, password: mockUser.password })
            //   .expect(res.statusCode).toEqual(200)
    
              .then((response) => {
                 console.log('responseresponse------------------------',response);
                var parsedTest = JSON.parse(response.text);
                expect(response.statusCode).toEqual(200);
                expect(parsedTest.status).toEqual(200);
                // expect(parsedTest.token).toBe('User does not exist.');
                expect.objectContaining({token: expect.any(String)})
              });
            })
});