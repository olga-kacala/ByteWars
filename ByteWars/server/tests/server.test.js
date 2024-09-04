const request = require("supertest");
const app = require("../server");
const User = require("../models/userModel");

describe("Server Endpoints", () => {
  let server;
  let token;

  beforeAll(async () => {
    server = app.listen(6000);

    await User.deleteAll();
    await request(server)
      .post("/api/v1/register")
      .send({ username: "testUser", password: "testPassword" });

    const loginResponse = await request(server)
      .post("/api/v1/login")
      .send({ username: "testUser", password: "testPassword" });

    token = loginResponse.body.token;
  });

  afterAll(() => {
    server.close();
  });

  describe("POST /api/v1/register", () => {
    it("should return 400 if username or password is missing", async () => {
      const response = await request(server)
        .post("/api/v1/register")
        .send({ username: "testUser" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Username and password are required");
    });

    it("should register a new user successfully", async () => {
      const response = await request(server)
        .post("/api/v1/register")
        .send({ username: "newUser", password: "newPassword" });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
    });
  });

  describe("POST /api/v1/login", () => {
    it("should return 401 for invalid credentials", async () => {
      const response = await request(server)
        .post("/api/v1/login")
        .send({ username: "testUser", password: "wrongPassword" });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid username or password");
    });

    it("should return 200 and a token for valid credentials", async () => {
      const response = await request(server)
        .post("/api/v1/login")
        .send({ username: "testUser", password: "testPassword" });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });
  });

  describe("POST /api/v1/startGame", () => {
    it("should return 400 if side is missing", async () => {
      const response = await request(server)
        .post("/api/v1/startGame")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Side is required");
    });

    it("should start a game successfully", async () => {
      const response = await request(server)
        .post("/api/v1/startGame")
        .set("Authorization", `Bearer ${token}`)
        .send({ side: "left" });

      expect(response.status).toBe(200);
      expect(response.body.gameId).toBeDefined();
      expect(response.body.status).toBe("initialized");
    });
  });

  describe("POST /api/v1/attack", () => {
    let gameId;

    beforeAll(async () => {
      const startGameResponse = await request(server)
        .post("/api/v1/startGame")
        .set("Authorization", `Bearer ${token}`)
        .send({ side: "left" });

      gameId = startGameResponse.body.gameId;
    });

    it("should return 400 if gameId or attackHP is missing", async () => {
      const response = await request(server)
        .post("/api/v1/attack")
        .set("Authorization", `Bearer ${token}`)
        .send({ attackHP: 20 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Game ID and HP are required");
    });

    it("should return 200 and updated game status for valid attack", async () => {
      const response = await request(server)
        .post("/api/v1/attack")
        .set("Authorization", `Bearer ${token}`)
        .send({ gameId, attackHP: 20 });

      expect(response.status).toBe(200);
      expect(response.body.userHealth).toBeDefined();
      expect(response.body.opponentHealth).toBeDefined();
      expect(response.body.gameStatus).toBeDefined();
    });
  });

  describe("POST /api/v1/saveAttack", () => {
    let gameId;

    beforeAll(async () => {
      const startGameResponse = await request(server)
        .post("/api/v1/startGame")
        .set("Authorization", `Bearer ${token}`)
        .send({ side: "left" });

      gameId = startGameResponse.body.gameId;
    });

    it("should return 400 if gameId, totalAttack, or gameStatus is missing", async () => {
      const response = await request(server)
        .post("/api/v1/saveAttack")
        .set("Authorization", `Bearer ${token}`)
        .send({ gameId, totalAttack: 50 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Game ID, total attack, and game status are required"
      );
    });

    it("should save the total attack successfully", async () => {
      const response = await request(server)
        .post("/api/v1/saveAttack")
        .set("Authorization", `Bearer ${token}`)
        .send({ gameId, totalAttack: 50, gameStatus: "ongoing" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Total attack saved successfully");
    });
  });

  describe("GET /api/v1/topResults", () => {
    it("should get top results", async () => {
      const response = await request(server)
        .get("/api/v1/topResults")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("DELETE /api/v1/deleteUsers", () => {
    it("should delete all users", async () => {
      const response = await request(server)
        .delete("/api/v1/deleteUsers")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });

  describe("DELETE /api/v1/deleteGames", () => {
    it("should delete all games", async () => {
      const response = await request(server)
        .delete("/api/v1/deleteGames")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });
  });
});
