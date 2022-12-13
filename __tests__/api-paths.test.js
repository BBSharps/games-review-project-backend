const request = require("supertest");
const { app } = require("../db/api/api");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const categories = require("../db/data/test-data/categories");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/categories", () => {
  test("status:200 should return an array of objects each withn slug and description", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((data) => {
        const result = data.body.categories;
        result.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("should return the whole data set. ", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((data) => {
        const result = data.body.categories;
        expect(result.length).toBe(4);
      });
  });
});

describe("error handeling", () => {
  test("status:404 when serching for an incorret path", () => {
    return request(app)
      .get("/api/not_a_path")
      .expect(404)
      .then((data) => {
        expect(data.body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/reviews", () => {
  test("status: 200 returns an array with review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((data) => {
        const reviews = data.body.reviews;
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_body: expect.any(String),
              review_id: expect.any(Number),
              review_img_url: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("should return the whole data set. ", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((data) => {
        const result = data.body.reviews;
        expect(result.length).toBe(13);
      });
  });
});
