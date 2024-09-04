const User = require("../models/userModel");
const jwt = require("../utils/jwt");
const { ValidationError, AuthenticationError } = require("../utils/errors");
const secret = process.env.JWT_SECRET;

const register = async (username, password) => {
  if (!username || !password) {
    throw new ValidationError("Username and password are required");
  }

  const existingUser = await User.findByUsername(username);
  if (existingUser) {
    throw new ValidationError("Username already exists");
  }

  const newUser = new User(username, password);
  await newUser.save();
};

const login = async (username, password) => {
  if (!username || !password) {
    throw new ValidationError("Username and password are required");
  }

  const user = await User.findByUsername(username);
  if (!user) {
    throw new AuthenticationError("Invalid username or password");
  }

  const isMatch = await User.comparePassword(password, user.password);
  if (!isMatch) {
    throw new AuthenticationError("Invalid username or password");
  }

  const token = jwt.sign({ userId: user.id }, secret);
  return { token };
};

const deleteUsers = async () => {
  return await User.deleteAll();
};

module.exports = {
  register,
  login,
  deleteUsers,
};
