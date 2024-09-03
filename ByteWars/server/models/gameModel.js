const db = require("../db/database");

class Game {
  constructor(side) {
    this.gameId = `game-${Date.now()}`;
    this.status = "initialized";
    this.side = side;
    this.turn = 0;
    this.userHealth = 100;
    this.opponentHealth = 100;
    this.attackHP = 0;
    this.totalAttack = 0;
  }

  async save() {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO games (gameId, status, side, turn, userHealth, opponentHealth, attackHP, totalAttack) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      db.run(
        query,
        [
          this.gameId,
          this.status,
          this.side,
          this.turn,
          this.userHealth,
          this.opponentHealth,
          this.attackHP,
          this.totalAttack,
        ],
         (err)=> {
          if (err) return reject(err);
          resolve({ gameId: this.gameId });
        }
      );
    });
  }

  static findById(gameId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM games WHERE gameId = ?";
      db.get(query, [gameId], (err, game) => {
        if (err) return reject(err);
        resolve(game);
      });
    });
  }

  static async updateHealth(
    gameId,
    userHealth,
    opponentHealth,
    turn,
    status,
    attackHP
  ) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE games SET userHealth = ?, opponentHealth = ?, turn = ?, status = ?, attackHP = ? WHERE gameId = ?";
      db.run(
        query,
        [userHealth, opponentHealth, turn, status, attackHP, gameId],
        function (err) {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  }

  static async updateTotalAttack(gameId, totalAttack, status) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE games SET totalAttack = ?, status = ? WHERE gameId = ?";
      db.run(query, [totalAttack, status, gameId], (err)=> {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  static getTopResults() {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM games WHERE status = 'won' ORDER BY totalAttack DESC LIMIT 10";
      db.all(query, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static async deleteAll() {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM games";
      db.run(query, (err)=> {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  }
}

module.exports = Game;
