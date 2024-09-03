const Game = require('../models/gameModel');
const db = require('../db/database');

jest.mock('../db/database'); 

describe('Game.save()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    db.run = jest.fn((query, params, callback) => {
      callback(null); // Default to success
    });
    db.get = jest.fn((query, params, callback) => {
      callback(null, {}); // Default to empty object for get
    });
    db.all = jest.fn((query, params, callback) => {
      callback(null, []); // Default to empty array for all
    });
  });
  
    it('should save a new game to the database', async () => {
      // Mock db.run to simulate database insertion
      db.run.mockImplementation((query, params, callback) => {
        callback(null); // Simulate success
      });

      const game = new Game('human');
      const result = await game.save();

      expect(result).toEqual({ gameId: game.gameId });
      expect(db.run).toHaveBeenCalledWith(
        expect.any(String), // query
        [
          game.gameId,
          game.status,
          game.side,
          game.turn,
          game.userHealth,
          game.opponentHealth,
          game.attackHP,
          game.totalAttack,
        ],
        expect.any(Function) // callback
      );
    });

    it('should throw an error when failing to save a new game', async () => {
      // Mock db.run to simulate a failure
      db.run.mockImplementation((query, params, callback) => {
        callback(new Error('Failed to save game'));
      });

      const game = new Game('robot');

      await expect(game.save()).rejects.toThrow('Failed to save game');
    });
  });

  describe('Game.findById()', () => {
    it('should find a game by gameId', async () => {
      const mockGame = {
        gameId: 'game-123',
        status: 'ongoing',
        side: 'human',
        turn: 1,
        userHealth: 80,
        opponentHealth: 90,
        attackHP: 10,
        totalAttack: 20,
      };

      db.get.mockImplementation((query, params, callback) => {
        callback(null, mockGame); // Simulate successful retrieval
      });

      const game = await Game.findById('game-123');

      expect(game).toEqual(mockGame);
      expect(db.get).toHaveBeenCalledWith(
        expect.any(String), // query
        ['game-123'],
        expect.any(Function) // callback
      );
    });

    it('should throw an error if the game is not found', async () => {
      db.get.mockImplementation((query, params, callback) => {
        callback(new Error('Game not found'));
      });

      await expect(Game.findById('non-existent')).rejects.toThrow(
        'Game not found'
      );
    });
  });

  describe('Game.updateHealth()', () => {
    it('should update health values of a game', async () => {
      db.run.mockImplementation((query, params, callback) => {
        callback(null); // Simulate success
      });

      await Game.updateHealth('game-123', 80, 50, 2, 'ongoing', 10);

      expect(db.run).toHaveBeenCalledWith(
        expect.any(String), // query
        [80, 50, 2, 'ongoing', 10, 'game-123'],
        expect.any(Function) // callback
      );
    });

    it('should throw an error when failing to update health values', async () => {
      db.run.mockImplementation((query, params, callback) => {
        callback(new Error('Failed to update health'));
      });

      await expect(
        Game.updateHealth('game-123', 80, 50, 2, 'ongoing', 10)
      ).rejects.toThrow('Failed to update health');
    });
  });

  describe('Game.updateTotalAttack()', () => {
    it('should update total attack values of a game', async () => {
      db.run.mockImplementation((query, params, callback) => {
        callback(null); // Simulate success
      });

      await Game.updateTotalAttack('game-123', 100, 'won');

      expect(db.run).toHaveBeenCalledWith(
        expect.any(String), // query
        [100, 'won', 'game-123'],
        expect.any(Function) // callback
      );
    });

    it('should throw an error when failing to update total attack', async () => {
      db.run.mockImplementation((query, params, callback) => {
        callback(new Error('Failed to update total attack'));
      });

      await expect(Game.updateTotalAttack('game-123', 100, 'won')).rejects.toThrow(
        'Failed to update total attack'
      );
    });
  });

  describe('Game.getTopResults()', () => {
    it('should get top results of games with status "won"', async () => {
      const mockResults = [
        { gameId: 'game-1', totalAttack: 150 },
        { gameId: 'game-2', totalAttack: 140 },
      ];

      db.all.mockImplementation((query, params, callback) => {
        callback(null, mockResults); // Simulate successful retrieval
      });

      const results = await Game.getTopResults();

      expect(results).toEqual(mockResults);
      expect(db.all).toHaveBeenCalledWith(
        expect.any(String), // query
        [],
        expect.any(Function) // callback
      );
    });

    it('should throw an error when failing to get top results', async () => {
      db.all.mockImplementation((query, params, callback) => {
        callback(new Error('Failed to get top results'));
      });

      await expect(Game.getTopResults()).rejects.toThrow('Failed to get top results');
    });
  });

  describe('Game.deleteAll()', () => {
    it('should delete all games from the database', async () => {
      db.run.mockImplementation((query, callback) => {
        callback(null); // Simulate success
      });

      await Game.deleteAll();

      expect(db.run).toHaveBeenCalledWith(
        expect.any(String), // query
        expect.any(Function) // callback
      );
    });

    it('should throw an error when failing to delete all games', async () => {
      db.run.mockImplementation((query, callback) => {
        callback(new Error('Failed to delete all games'));
      });

      await expect(Game.deleteAll()).rejects.toThrow('Failed to delete all games');
    });
  });
