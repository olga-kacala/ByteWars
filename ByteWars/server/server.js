require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("./utils/jwt");
const path = require("path");
const cors = require("cors");
const User = require("./classes/User");
const Game = require("./classes/Game");

const app = express();
const PORT = process.env.PORT;
const secret = process.env.JWT_SECRET;

app.use(cors());
app.use(bodyParser.json());

// Endpoint: Register User
app.post("/api/v1/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = new User(username, password);
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error('Registration Error:', err.message);
    res
      .status(500)
      .json({ message: "User registration failed", error: err.message });
  }
});

//Endpoint: Login User
app.post("/api/v1/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
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
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// Endpoint: Start Game
app.post("/api/v1/startGame", async (req, res) => {
  const { side } = req.body;
  if (!side) {
    return res.status(400).json({ message: "Side is required" });
  }
  try {
    const game = new Game(side);
    await game.save();
    res.json({ gameId: game.gameId, status: game.status });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Game creation failed", error: err.message });
  }
});

// Endpoint: Attack move
app.post("/api/v1/attack", async (req, res) => {
  const { gameId, attackHP } = req.body;
  if (!gameId && attackHP) {
    return res.status(400).json({ message: "Game ID and HP is required" });
  }
  try {
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Check if the game is already finished
    if (game.userHealth <= 0 || game.opponentHealth <= 0) {
      return res.status(400).json({ message: "The game is already finished" });
    }

    const userAttackPower = attackHP;
    const newOpponentHealth = Math.max(
      game.opponentHealth - userAttackPower,
      0
    );

    // Determine the game status after user attack
    let gameStatus = "ongoing";
    if (newOpponentHealth <= 0) {
      gameStatus = "won";
    }

    const opponentAttackPower = Math.floor(Math.random() * (35 - 10 + 1)) + 10; // Random power between 10-35

    const newUserHealth = Math.max(game.userHealth - opponentAttackPower, 0); // Simulating opponent's attack

    // Increment turn
    const newTurn = game.turn + 1;

    // Determine the game status after opponent attack
    if (newUserHealth <= 0) {
      gameStatus = "lost";
    }

    await Game.updateHealth(
      gameId,
      newUserHealth,
      newOpponentHealth,
      newTurn,
      gameStatus
    );

    res.json({
      message: "Attack successful",
      userHealth: newUserHealth,
      opponentHealth: newOpponentHealth,
      turn: newTurn,
      gameStatus: gameStatus,
      attackHP: attackHP,
      opponentAttackPower: opponentAttackPower,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to make attack", error: err.message });
  }
});

// Endpoint: Save Total Attack
app.post("/api/v1/saveAttack", async (req, res) => {
  const { gameId, totalAttack, gameStatus } = req.body;

  if (!gameId || totalAttack === undefined || !gameStatus) {
    return res
      .status(400)
      .json({ message: "Game ID, total attack, and game status are required" });
  }

  try {
    await Game.updateTotalAttack(gameId, totalAttack, gameStatus);
    res.json({ message: "Total attack saved successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to save total attack", error: err.message });
  }
});

// Endpoint: Get Top 10 Results
app.get("/api/v1/topResults", async (req, res) => {
  try {
    const topResults = await Game.getTopResults();
    res.json(topResults);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve top results", error: err.message });
  }
});

// Endpoint: Delete all users
app.delete("/api/v1/deleteUsers", async (req, res) => {
  try {
    const deletedRows = await User.deleteAll();
    res.json({ message: `${deletedRows} users deleted successfully` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete users", error: err.message });
  }
});

// // Endpoint: Delete all games
app.delete("/api/v1/deleteGames", async (req, res) => {
  try {
    const deletedRows = await Game.deleteAll();
    res.json({ message: `${deletedRows} games deleted successfully` });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete games", error: err.message });
  }
});

// Middleware to verify JWT
app.use("/api/v1", (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
});

// Serve React App
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is runing on http://localhost:${PORT}`);
});

module.exports = app; 