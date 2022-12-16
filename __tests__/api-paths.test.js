const request = require("supertest");
const { app } = require("../api/api");
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
  test("when a category query is added should only return reviews in that category", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then((data) => {
        const reviews = data.body.reviews;
        expect(reviews).toHaveLength(1);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_id: expect.any(Number),
              review_img_url: expect.any(String),
              category: "dexterity",
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("the results should be sorted buy the requestd column in descending order", () => {
    return request(app)
      .get("/api/reviews?sorted_by=designer")
      .then((data) => {
        const result = data.body.reviews;
        expect(result).toBeSortedBy("designer", { descending: true });
      });
  });
  test("the results should be sorted buy the requestd column in descending order", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .then((data) => {
        const result = data.body.reviews;
        expect(result).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("all querys should be able to work togeather", () => {
    return request(app)
      .get(
        "/api/reviews?category=social deduction&order=asc&sorted_by=designer"
      )
      .expect(200)
      .then((data) => {
        const reviews = data.body.reviews;
        expect(reviews).toHaveLength(11);
        expect(reviews).toBeSortedBy("designer", { descending: false });
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_id: expect.any(Number),
              review_img_url: expect.any(String),
              category: "social deduction",
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  test("status:404 when given an invalid category", () => {
    return request(app)
      .get("/api/reviews?category=banana")
      .expect(404)
      .then((data) => {
        expect(data._body.msg).toBe("not found");
      });
  });
  test("status:400 when given an invalid column to sort by", () => {
    return request(app)
      .get("/api/reviews?sorted_by=banana")
      .expect(400)
      .then((data) => {
        expect(data._body.msg).toBe("not a valid request");
      });
  });
  test("status:400 when given an invalid order", () => {
    return request(app)
      .get("/api/reviews?order=banana")
      .expect(400)
      .then((data) => {
        expect(data._body.msg).toBe("not a valid request");
      });
  });
});
describe("GET /api/reviews/:review_id", () => {
  test("status: 200 returns an array with review objects", () => {
    return request(app)
      .get("/api/reviews/3")
      .expect(200)
      .then((data) => {
        const review = data.body.reviewId;
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

  test("should return only the required review", () => {
    return request(app)
      .get("/api/reviews/4")
      .expect(200)
      .then((data) => {
        const result = data.body.reviewId;
        expect(result.review_id).toBe(4);
      });
  });
  test("status:404 when serching for an invalid id in reviews", () => {
    return request(app)
      .get("/api/reviews/92")
      .expect(404)
      .then((data) => {
        expect(data._body.msg).toBe("not a valid id");
      });
  });
  test("status:400 when serching for a bad request", () => {
    return request(app)
      .get("/api/reviews/banana")
      .expect(400)
      .then((data) => {
        expect(data._body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("status: 200 returns an array with the comment objects", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((data) => {
        const reviews = data.body.comments;
        reviews.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: 3,
            })
          );
        });
      });
  });
  test("comments should be ordered from newest to oldest and return the correct ammount", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((data) => {
        const comments = data.body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
        expect(comments).toHaveLength(3);
      });
  });
  test("status: 200,if a valid id is given but there are no comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((data) => {
        const comments = data.body.comments;
        expect(comments).toHaveLength(0);
      });
  });
  test("status:404 when serching for an invalid id in reviews", () => {
    return request(app)
      .get("/api/reviews/92/comments")
      .expect(404)
      .then((data) => {
        expect(data._body.msg).toBe("not a valid id");
      });
  });
  test("status:400 when serching for a bad request", () => {
    return request(app)
      .get("/api/reviews/banana/comments")
      .expect(400)
      .then((data) => {
        expect(data._body.msg).toBe("bad request");
      });
  });
});
describe("POST /api/reviews/:revied_id/comments", () => {
  test("should be able to take a username and a body as input and post a new comment with the review_id matching the url", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ userName: "dav3rid", body: "Rubarb,rubarb,rubarb" })
      .expect(201)
      .then((data) => {
        const newComment = data.body.comment;
        expect(newComment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 1,
          })
        );
      });
  });
  test("status: 400 if any of the request data is missing", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ body: "Rubarb,rubarb,rubarb" })
      .expect(400)
      .then((data) => {
        expect(data._body.msg).toBe("missing information in POST request");
      });
  });
  test("status: 400 if any of the request data is missing", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .send({ userName: "dav3rid" })
      .expect(400)
      .then((data) => {
        expect(data._body.msg).toBe("missing information in POST request");
      });
  });
  test("status:404 when serching for an invalid id in reviews", () => {
    return request(app)
      .post("/api/reviews/38/comments")
      .send({ userName: "dav3rid", body: "Rubarb,rubarb,rubarb" })
      .expect(404)
      .then((data) => {
        expect(data._body.msg).toBe("not a valid input");
      });
  });
  test("status:400 when serching for a bad request", () => {
    return request(app)
      .post("/api/reviews/banana/comments")
      .send({ userName: "dav3rid", body: "Rubarb,rubarb,rubarb" })
      .expect(400)
      .then((data) => {
        expect(data._body.msg).toBe("bad request");
      });
  });
  test("status:404 when trying to post none existant userName", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({ userName: "TimTam", body: "Rubarb,rubarb,rubarb" })
      .expect(404)
      .then((data) => {
        expect(data._body.msg).toBe("not a valid input");
      });
  });
});
describe("PATCH /api/reviews/:review_id", () => {
  test("status: 200 returns the updated review", () => {
    return request(app)
      .patch("/api/reviews/5")
      .send({ inc_votes: 10 })
      .expect(200)
      .then((data) => {
        const review = data.body.reviewVote;
        expect(review).toEqual(
          expect.objectContaining({
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_id: 5,
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: 15,
            review_body: expect.any(String),
          })
        );
      });
  });
  test("status: 200 returns the updated review when minused", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: -3 })
      .expect(200)
      .then((data) => {
        const review = data.body.reviewVote;
        expect(review).toEqual(
          expect.objectContaining({
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_id: 2,
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: 2,
            review_body: expect.any(String),
          })
        );
      });
  });
  test("status:404 when serching for an invalid id in reviews", () => {
    return request(app)
      .patch("/api/reviews/92")
      .send({ inc_votes: 3 })
      .expect(404)
      .then((data) => {
        expect(data._body.msg).toBe("not a valid id");
      });
  });
  test("status:400 when serching for a bad request", () => {
    return request(app)
      .patch("/api/reviews/banana")
      .send({ inc_votes: 3 })
      .expect(400)
      .then((data) => {
        expect(data._body.msg).toBe("bad request");
      });
  });
  test("status:400 when missing information in post request", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({})
      .expect(400)
      .then((data) => {
        expect(data._body.msg).toBe("missing information in POST request");
      });
  });
});
describe("GET /api/users", () => {
  test("status: 200 returns the updated review", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((data) => {
        const users = data.body.users;
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("should return the whole data set", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((data) => {
        const users = data.body.users;
        expect(users).toHaveLength(4);
      });
  });
});

describe("error handling", () => {
  test("status:404 when serching for an incorret path", () => {
    return request(app).get("/api/not_a_path").expect(404);
  });
});
