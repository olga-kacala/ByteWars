
-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
    gameId TEXT PRIMARY KEY,
    status TEXT,
    side TEXT,
    turn INTEGER,
    userHealth INTEGER,
    opponentHealth INTEGER,
    attackHP INTEGER,
    totalAttack INTEGER DEFAULT 0
);
