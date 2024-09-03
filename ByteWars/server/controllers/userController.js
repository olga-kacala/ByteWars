const User = require("../models/userModel");
const jwt = require("../utils/jwt");
const secret = process.env.JWT_SECRET;

const register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  try {
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const newUser = new User(username, password);
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "User registration failed", error: err.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ userId: user.id }, secret);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "User login failed", error: err.message });
  }
};

const deleteUsers = async (req, res) => {
  try {
    const deletedRows = await User.deleteAll();
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
