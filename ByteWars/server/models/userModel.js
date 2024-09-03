const bcrypt = require("bcrypt");
const db = require("../db/database");

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  static async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async save() {
    const hashedPassword = await User.hashPassword(this.password);
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO users (username, password) VALUES (?, ?)";
      db.run(query, [this.username, hashedPassword], function (err) {
        if (err) return reject(err);
        resolve({ userId: this.lastID });
      });
    });
  }

  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE username = ?";
      db.get(query, [username], (err, user) => {
        if (err) return reject(err);
        resolve(user);
      });
    });
  }

  static async comparePassword(inputPassword, storedPassword) {
    return await bcrypt.compare(inputPassword, storedPassword);
  }

  static async deleteAll() {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM users";
      db.run(query, function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      });
    });
  }
}

module.exports = User;
