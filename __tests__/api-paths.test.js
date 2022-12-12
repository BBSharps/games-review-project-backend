const request = require("supertest");
const { app } = require("../db/api/api");

describe("GET /api", () => {
  test("status:200", () => {
    return request(app).get("/api").expect(200);
  });
});

describe("GET /api/categories", () => {
  test("status:200 should return an array of objects each withn slug and description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((data) => {
        const result = data.body.categories;
        expect(result[0]).toEqual(
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          })
        );
      });
  });
  test.only("status:404 when serching for an incorret path", () => {
    return request(app)
      .get("/api/catago")
      .expect(404)
      .then((data) => {
        expect(data.body.msg).toBe("Path not found");
      });
  });
});
