// we will use supertest to test HTTP requests/responses
const request = require("supertest");
// we also need our app for the correct routes!
const app = require("../app");

test("Add Product Test", async (done) => {
  const product = {
    SKU: "134",
    Keywords: "nothing",
    Description: "nothing",
    URL: "http://amazon.com",
  };

  await request(app)
    .post("/retail")
    .send(product)
    .then(async () => {
      done();
    })
    .catch((err) => {
      // write test for failure here
      console.log(`Error ${err}`);
      done();
    });
});

test("Add Product Button Working", async () => {
  const res = await request(app).get("/retail");
  expect(res.status).toEqual(302);
});
