const Game = require("../models/gameModel");

const startGame = async (req, res) => {
  const { side } = req.body;
  if (!side) {
    return res.status(400).json({ message: "Side is required" });
  }
  try {
    const game = new Game(side);
    await game.save();
    res.json({ gameId: game.gameId, status: game.status });
  } catch (err) {
    res.status(500).json({ message: "Game creation failed", error: err.message });
  }
};

const attack = async (req, res) => {
  const { gameId, attackHP } = req.body;
  if (!gameId || attackHP === undefined) {
    return res.status(400).json({ message: "Game ID and HP are required" });
  }
  try {
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }
    if (game.userHealth <= 0 || game.opponentHealth <= 0) {
      return res.status(400).json({ message: "The game is already finished" });
    }
    const userAttackPower = attackHP;
    const newOpponentHealth = Math.max(game.opponentHealth - userAttackPower, 0);
    let gameStatus = "ongoing";
    if (newOpponentHealth <= 0) {
      gameStatus = "won";
    }
    const opponentAttackPower = Math.floor(Math.random() * (35 - 10 + 1)) + 10;
    const newUserHealth = Math.max(game.userHealth - opponentAttackPower, 0);
    const newTurn = game.turn + 1;
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
    res.status(500).json({ message: "Failed to make attack", error: err.message });
  }
};

const saveAttack = async (req, res) => {
  const { gameId, totalAttack, gameStatus } = req.body;
  if (!gameId || totalAttack === undefined || !gameStatus) {
    return res.status(400).json({ message: "Game ID, total attack, and game status are required" });
  }
  try {
    await Game.updateTotalAttack(gameId, totalAttack, gameStatus);
    res.json({ message: "Total attack saved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to save total attack", error: err.message });
  }
};

const getTopResults = async (req, res) => {
  try {
    const topResults = await Game.getTopResults();
    res.json(topResults);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve top results", error: err.message });
  }
};

const deleteGames = async (req, res) => {
  try {
    const deletedRows = await Game.deleteAll();
    res.json({ message: `${deletedRows} games deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete games", error: err.message });
  }
};

module.exports = {
  startGame,
  attack,
  saveAttack,
  getTopResults,
  deleteGames,
};
