const request = require("supertest");
const express = require("express");
const app = require("./server");

describe("Server Endpoints", () => {
  let server;

  beforeAll(() => {
    server = app.listen(6000);
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
  });

  describe("POST /api/v1/login", () => {
    it("should return 401 for invalid credentials", async () => {
      const response = await request(server)
        .post("/api/v1/login")
        .send({ username: "testUser", password: "wrongPassword" });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid username or password");
    });
  });

  describe("POST /api/v1/startGame", () => {
    it("should return 400 if side is missing", async () => {
      const response = await request(server).post("/api/v1/startGame").send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Side is required");
    });
  });

  describe("POST /api/v1/attack", () => {
    it("should return 400 if gameId or attackHP is missing", async () => {
      const response = await request(server)
        .post("/api/v1/attack")
        .send({ attackHP: 20 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Game ID and HP is required");
    });
  });

  describe("POST /api/v1/saveAttack", () => {
    it("should return 400 if gameId, totalAttack, or gameStatus is missing", async () => {
      const response = await request(server)
        .post("/api/v1/saveAttack")
        .send({ gameId: "some-game-id", totalAttack: 50 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Game ID, total attack, and game status are required"
      );
    });
  });

  describe("GET /api/v1/topResults", () => {
    it("should get top results", async () => {
      const response = await request(server).get("/api/v1/topResults");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
