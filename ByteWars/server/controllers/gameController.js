const gameService = require("../services/gameService");
const { ValidationError, NotFoundError } = require("../utils/errors");

const startGame = async (req, res) => {
  try {
    const { side } = req.body;
    const result = await gameService.startGame(side);
    res.json(result);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An error occurred while starting the game", error: err.message });
    }
  }
};

const attack = async (req, res) => {
  try {
    const { gameId, attackHP } = req.body;
    const result = await gameService.attack(gameId, attackHP);
    res.json(result);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof NotFoundError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An error occurred during the attack", error: err.message });
    }
  }
};

const saveAttack = async (req, res) => {
  try {
    const { gameId, totalAttack, gameStatus } = req.body;
    await gameService.saveAttack(gameId, totalAttack, gameStatus);
    res.json({ message: "Total attack saved successfully" });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: "An error occurred while saving the attack", error: err.message });
    }
  }
};

const getTopResults = async (req, res) => {
  try {
    const results = await gameService.getTopResults();
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve top results", error: err.message });
  }
};

const deleteGames = async (req, res) => {
  try {
    const deletedRows = await gameService.deleteGames();
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
