const userService = require("../services/userService");
const { ValidationError, AuthenticationError } = require("../utils/errors");

const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    await userService.register(username, password);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: "User registration failed", error: err.message });
    }
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await userService.login(username, password);
    res.json(result);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof AuthenticationError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: "User login failed", error: err.message });
    }
  }
};

const deleteUsers = async (req, res) => {
  try {
    const deletedRows = await userService.deleteUsers();
    res.json({ message: `${deletedRows} users deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete users", error: err.message });
  }
};

module.exports = {
  register,
  login,
  deleteUsers,
};
