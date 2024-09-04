const Game = require("../models/gameModel");
const { ValidationError, NotFoundError } = require("../utils/errors");

const startGame = async (side) => {
  if (!side) {
    throw new ValidationError("Side is required");
  }
  
  const game = new Game(side);
  await game.save();
  return { gameId: game.gameId, status: game.status };
};

const attack = async (gameId, attackHP) => {
  if (!gameId || attackHP === undefined) {
    throw new ValidationError("Game ID and HP are required");
  }

  const game = await Game.findById(gameId);
  if (!game) {
    throw new NotFoundError("Game not found");
  }

  if (game.userHealth <= 0 || game.opponentHealth <= 0) {
    throw new ValidationError("The game is already finished");
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

  await Game.updateHealth(gameId, newUserHealth, newOpponentHealth, newTurn, gameStatus);

  return {
    userHealth: newUserHealth,
    opponentHealth: newOpponentHealth,
    turn: newTurn,
    gameStatus,
    attackHP,
    opponentAttackPower,
  };
};

const saveAttack = async (gameId, totalAttack, gameStatus) => {
  if (!gameId || totalAttack === undefined || !gameStatus) {
    throw new ValidationError("Game ID, total attack, and game status are required");
  }

  await Game.updateTotalAttack(gameId, totalAttack, gameStatus);
};

const getTopResults = async () => {
  return await Game.getTopResults();
};

const deleteGames = async () => {
  return await Game.deleteAll();
};

module.exports = {
  startGame,
  attack,
  saveAttack,
  getTopResults,
  deleteGames,
};
