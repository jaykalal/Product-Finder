// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes!
const app = require("../app");

test("Register User", async (done) => {
  const user = {
    email: "abdc@gmail.com",
    password: "Abc@126",
    confirmEmail: "abdc@gmail.com",
    confirmPassword: "Abc@126",
  };

  await request(app)
    .post("/register")
    .send(user)
    .then(async () => {
      done();
    })
    .catch((err) => {
      // write test for failure here
      console.log(`Error ${err}`);
      done();
    });
});

test("Registration Button Working", async () => {
  const res = await request(app).get("/registration");
  expect(res.status).toEqual(200);
});

test("Login User", async (done) => {
  const user = {
    email: "abdc@gmail.com",
    password: "Abc@123",
  };

  await request(app)
    .post("/login")
    .send(user)
    .then(async () => {
      done();
    })
    .catch((err) => {
      // write test for failure here
      console.log(`Error ${err}`);
      done();
    });
});

test("Login Button Working", async () => {
  const res = await request(app).get("/login");
  expect(res.status).toEqual(200);
});
