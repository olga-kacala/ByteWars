const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");

router.post('/startGame', gameController.startGame);
router.post('/attack', gameController.attack);
router.post('/saveAttack', gameController.saveAttack);
router.get('/topResults', gameController.getTopResults);
router.delete('/deleteGames', gameController.deleteGames);

module.exports = router;
