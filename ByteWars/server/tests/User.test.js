const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const db = require("../db/database");

jest.mock("../db/database");
jest.mock("bcrypt");

describe("User Class", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("User.hashPassword()", () => {
    it("should hash a password with bcrypt", async () => {
      bcrypt.hash.mockResolvedValue("hashedPassword");

      const hashed = await User.hashPassword("myPassword");

      expect(hashed).toBe("hashedPassword");
      expect(bcrypt.hash).toHaveBeenCalledWith("myPassword", 10);
    });
  });

  describe("User.save()", () => {
    it("should save a new user with hashed password to the database", async () => {
      const mockHashedPassword = "hashedPassword";
      bcrypt.hash.mockResolvedValue(mockHashedPassword);

      db.run.mockImplementation(function (query, params, callback) {
        callback.call({ lastID: 1 }, null);
      });

      const user = new User("testUser", "testPassword");
      const result = await user.save();

      expect(result).toEqual({ userId: 1 });
      expect(db.run).toHaveBeenCalledWith(
        expect.any(String),
        ["testUser", mockHashedPassword],
        expect.any(Function)
      );
    });

    it("should throw an error when failing to save a new user", async () => {
      bcrypt.hash.mockResolvedValue("hashedPassword");
      db.run.mockImplementation((query, params, callback) => {
        callback(new Error("Failed to save user"));
      });

      const user = new User("testUser", "testPassword");

      await expect(user.save()).rejects.toThrow("Failed to save user");
    });
  });

  describe("User.findByUsername()", () => {
    it("should find a user by username", async () => {
      const mockUser = {
        userId: 1,
        username: "testUser",
        password: "hashedPassword",
      };

      db.get.mockImplementation((query, params, callback) => {
        callback(null, mockUser); // Simulate successful retrieval
      });

      const user = await User.findByUsername("testUser");

      expect(user).toEqual(mockUser);
      expect(db.get).toHaveBeenCalledWith(
        expect.any(String),
        ["testUser"],
        expect.any(Function)
      );
    });

    it("should throw an error if the user is not found", async () => {
      db.get.mockImplementation((query, params, callback) => {
        callback(new Error("User not found"));
      });

      await expect(User.findByUsername("non-existent")).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("User.comparePassword()", () => {
    it("should return true for matching passwords", async () => {
      bcrypt.compare.mockResolvedValue(true);

      const isMatch = await User.comparePassword(
        "inputPassword",
        "storedPassword"
      );

      expect(isMatch).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "inputPassword",
        "storedPassword"
      );
    });

    it("should return false for non-matching passwords", async () => {
      bcrypt.compare.mockResolvedValue(false);

      const isMatch = await User.comparePassword(
        "wrongPassword",
        "storedPassword"
      );

      expect(isMatch).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrongPassword",
        "storedPassword"
      );
    });
  });

  describe("User.deleteAll()", () => {
    it("should delete all users from the database", async () => {
      db.run.mockImplementation(function (query, callback) {
        callback.call({ changes: 3 }, null);
      });

      const result = await User.deleteAll();

      expect(result).toBe(3);
      expect(db.run).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Function)
      );
    });
  });
});
