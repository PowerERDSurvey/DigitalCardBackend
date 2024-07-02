const request = require('supertest');
const { app, start, stop } = require('../server');
const { token } = require('morgan');



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
            
            expect(res.body.message).toBe(`User created successfully. verification link send to ${mockUser.email}`);
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