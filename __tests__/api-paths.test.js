const request = require("supertest");
const { app } = require("../db/api/api");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const categories = require("../db/data/test-data/categories");
const { toBeSortedBy } = require("");

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
              review_id: expect.any(Number),
              review_img_url: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
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
  test("the reviews that have comments should have the correct ammount of comments", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((data) => {
        const result = data.body.reviews;
        const filteredReview = result.filter((review) => {
          return review.comment_count === "3";
        });
        filteredReview.forEach((filtered) => {
          expect(filtered).toEqual(
            expect.objectContaining({
              comment_count: "3",
            })
          );
        });
      });
  });
  test("the results should be sorted buy created_at in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .then((data) => {
        const result = data.body.reviews;
        expect(result).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("GET /api/reviews/:review_id", () => {
  test("status: 200 returns an array with review objects", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then((data) => {
        const reviews = data.body.reviews;
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_id: 3,
              review_img_url: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              review_body: expect.any(String),
            })
          );
        });
      });
  });
  test("should return only the required review", () => {
    return request(app)
      .get("/api/reviews/4")
      .expect(200)
      .then((data) => {
        const result = data.body.reviews;
        expect(result.length).toBe(1);
      });
  });
  test("status:404 when serching for a missing id in reviews", () => {
    return request(app).get("/api/reviews/92").expect(404);
  });
  test("status:400 when serching for an invalid id", () => {
    return request(app).get("/api/reviews/banana").expect(400);
  });
});

describe("error handeling", () => {
  test("status:404 when serching for an incorret path", () => {
    return request(app).get("/api/not_a_path").expect(404);
  });
});
