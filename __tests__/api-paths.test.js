const request = require("supertest");
const { app } = require("../api/api");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
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
  test("the results should be sorted by created_at in descending order", () => {
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
  test("when a category query is added but there are 0 reviews in that category should return an empty array", () => {
    return request(app)
      .get("/api/reviews?category=children's games")
      .expect(200)
      .then((data) => {
        const reviews = data.body.reviews;
        expect(reviews).toHaveLength(0);
      });
  });
  test("the results should be sorted by the requestd sort_by or created_at in descending order", () => {
    return request(app)
      .get("/api/reviews?sorted_by=designer")
      .then((data) => {
        const result = data.body.reviews;
        expect(result).toBeSortedBy("designer", { descending: true });
      });
  });
  test("the results should be sorted buy the requestd sort_by or created_at in ascending order if order = asc", () => {
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
  test("status:400 when given a bad category request", () => {
    return request(app)
      .get("/api/reviews?category=banana")
      .expect(400)
      .then((data) => {
        expect(data._body.msg).toBe("bad request");
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
            comment_count: "3",
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
  test("status:404 when serching for an id that would be valid but is not in the database", () => {
    return request(app)
      .get("/api/reviews/92")
      .expect(404)
      .then((data) => {
        expect(data._body.msg).toBe("id not found");
      });
  });
  test("status:400 when serching for a bad id request", () => {
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
  test("status:404 when serching for an id that would be valid but is not in the database", () => {
    return request(app)
      .get("/api/reviews/92/comments")
      .expect(404)
      .then((data) => {
        expect(data._body.msg).toBe("id not found");
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
  test("status:404 when given an id that would be valid but is not in the database", () => {
    return request(app)
      .post("/api/reviews/38/comments")
      .send({ userName: "dav3rid", body: "Rubarb,rubarb,rubarb" })
      .expect(404)
      .then((data) => {
        expect(data._body.msg).toBe("not found");
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
  test("status:404 when trying to post with a none existing userName", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({ userName: "TimTam", body: "Rubarb,rubarb,rubarb" })
      .expect(404)
      .then((data) => {
        expect(data._body.msg).toBe("not found");
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
  test("status:404 when serching for an id  that would be valid but is not in the database", () => {
    return request(app)
      .patch("/api/reviews/92")
      .send({ inc_votes: 3 })
      .expect(404)
      .then((data) => {
        expect(data._body.msg).toBe("id not found");
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
describe("DELETE /api/comments/:comment_id", () => {
  test("status:204 and returns no content when a delete request is made", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((data) => {
        const response = data.body;
        expect(response).toEqual({});
      });
  });
  test("status:404 when given an id that would be valid but is not in the database", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then((data) => {
        expect(data._body.msg).toBe("id not found");
      });
  });
  test("status:400 when when given a bad request", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then((data) => {
        expect(data._body.msg).toBe("bad request");
      });
  });
});
describe("error handling", () => {
  test("status:404 when serching for an incorret path", () => {
    return request(app).get("/api/not_a_path").expect(404);
  });
});
describe("GET /api/", () => {
  test("status:200 and returns an object", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then((data) => {
        const response = data.body;
        expect(response).toBeInstanceOf(Object);
      });
  });
  test("status:200 and returns a list of api paths and descriptions", () => {
    return request(app)
      .get("/api/")
      .expect(200)
      .then((data) => {
        const response = data.body;
        console.log(response);
        expect(response).toEqual({
          api: {
            "GET /api": {
              description:
                "responds with a description of all paths and information on each",
            },
            "GET /api/categories": {
              description: "responds with an array of all categories",
              queries: [],
              exampleResponse: {
                categories: [
                  {
                    slug: "strategy",
                    description:
                      "Strategy-focused board games that prioritise limited-randomness",
                  },
                ],
              },
            },
            "GET /api/reviews": {
              description: "responds with an array of all reviews",
              queries: ["category", "sorted_by", "order"],
              exampleResponse: {
                reviews: [
                  {
                    title: "Velit tempor ullamco amet ipsum dolor voluptate.",
                    designer: "Don Keigh",
                    owner: "cooljmessy",
                    review_id: 14,
                    review_img_url:
                      "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
                    category: "hidden-roles",
                    created_at: "2021-02-05T11:27:26.563Z",
                    votes: 214,
                    comment_count: "4",
                  },
                ],
              },
            },
            "GET /api/reviews/:review_id": {
              description:
                "responds with an object with the review that matches the /:review_id ",
              queries: [],
              exampleResponse: {
                reviewId: {
                  title: "A truly Quacking Game; Quacks of Quedlinburg",
                  designer: "Wolfgang Warsch",
                  owner: "happyamy2016",
                  review_id: 5,
                  review_img_url:
                    "https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg",
                  category: "push-your-luck",
                  created_at: "2021-01-18T10:01:41.251Z",
                  votes: 10,
                  review_body:
                    "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
                  comment_count: "1",
                },
              },
            },
            "GET /api/reviews/:review_id/comments": {
              description:
                "responds with an array of comments thats belong to the review that matches the /:review_id ",
              queries: [],
              exampleResponse: {
                comments: [
                  {
                    comment_id: 12,
                    votes: 8,
                    created_at: "2021-03-27T14:15:51.110Z",
                    author: "tickle122",
                    body: "Aliquip aliqua ad fugiat anim ex elit consectetur ut fugiat ex qui.",
                    review_id: 5,
                  },
                ],
              },
            },
            "GET /api/users": {
              description:
                "responds with an array of users and thier information",
              queries: [],
              exampleResponse: {
                users: [
                  {
                    username: "tickle122",
                    name: "Tom Tickle",
                    avatar_url:
                      "https://vignette.wikia.nocookie.net/mrmen/images/d/d6/Mr-Tickle-9a.png/revision/latest?cb=20180127221953",
                  },
                ],
              },
            },
            "POST /api/reviews/:review_id/comments": {
              description:
                "post a new comment with the review_id = /:review_id. requires a body to be sent and responds with the new comment information",
              exampleBody: {
                userName: "tickle122",
                body: "this is a new comment",
              },
              exampleResponse: {
                comment: {
                  comment_id: 144,
                  body: "this is a new comment",
                  review_id: 10,
                  author: "tickle122",
                  votes: 0,
                  created_at: "2023-01-18T21:25:24.482Z",
                },
              },
            },
            "PATCH /api/reviews/:review_id": {
              description:
                "patch the reviews votes with the review_id = /:review_id. requires a body to be sent and responds with the new review information",
              exampleBody: {
                inc_votes: 1,
              },
              exampleResponse: {
                reviewVote: {
                  review_id: 10,
                  title: "Super Rhino Hero",
                  category: "dexterity",
                  designer: "Gamey McGameface",
                  owner: "jessjelly",
                  review_body:
                    "Consequat velit occaecat voluptate do. Dolor pariatur fugiat sint et proident ex do consequat est. Nisi minim laboris mollit cupidatat et adipisicing laborum do. Sint sit tempor officia pariatur duis ullamco labore ipsum nisi voluptate nulla eu veniam. Et do ad id dolore id cillum non non culpa. Cillum mollit dolor dolore excepteur aliquip. Cillum aliquip quis aute enim anim ex laborum officia. Aliqua magna elit reprehenderit Lorem elit non laboris irure qui aliquip ad proident. Qui enim mollit Lorem labore eiusmod",
                  review_img_url:
                    "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                  created_at: "2021-01-22T11:35:50.936Z",
                  votes: 8,
                },
              },
            },
            "DELETE /api/comments/:comment_id": {
              description:
                "deletes a comment with the comment_id that matches the /:comment_id ",
              exampleResponse: "status code 204 with not content",
            },
          },
        });
      });
  });
});
