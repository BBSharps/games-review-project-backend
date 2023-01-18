exports.apiPaths = Promise.resolve({
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
    description: "responds with an array of users and thier information",
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
});
