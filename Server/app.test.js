const request = require('supertest');
const app = require('./app.js');

// describe("POST /api/register", () => {

//   describe("Given a unique username and email and having every field filled out", () => {
//     test("should respond with 200 status code", async () => {
//       const response = await request(app).post("/api/register").send({
//         "username": "timur123",
//         "email": "aresk2k@gmail.com",
//         "firstname": "Timur",
//         "surname": "Sultanov",
//         "password": "sultanov",
//         "confirmPass": "sultanov"
//       })
//       expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
//       expect(response.body.status).toBe(200);
//     })
//   })
// })

let token = "";
describe("POST /api/login", () => {
  describe("Given username and password", () => {
    test("should respond with 200 status code", async () => {
      const response = await request(app).post("/api/login").send({
        "username": "user4",
        "password": "sultanov"
      })
      expect(response.body.status).toBe(200);
      token = response.body.token;
    })
  })
})

describe("GET /api/profile", () => {
  describe("Given a valid JWT token", () => {
    test("should return the currently logged in user's profile", async () => {
      const response = await request(app).get("/api/profile").auth(token, { type: 'bearer' });
      expect(response.body.status).toBe(200);
    })
  })
})

describe("GET /api/mutual", () => {
  describe("Given a valid JWT token", () => {
    test("should return users with shared mutual interests", async () => {
      const response = await request(app).get("/api/mutual").auth(token, { type: 'bearer' });
      expect(response.body.status).toBe(200);
    })
  })
})