
app.post("/api/v1/attack", (req, res) => {
  const { gameId } = req.body;
  if (!gameId) {
    return res.status(400).json({ message: "Game ID is required" });
  }
  const query = "SELECT * FROM games WHERE gameId = ?";
  db.get(query, [gameId], (err, game) => {
    if (err || !game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const userAttackPower = Math.floor(Math.random() * (50 - 30 + 1)) + 30; // Random power between 30-50
    const opponentAttackPower = Math.floor(Math.random() * (50 - 30 + 1)) + 30; // Random power between 30-50

    console.log(`User Attack Power: ${userAttackPower}`);
    console.log(`Opponent Attack Power: ${opponentAttackPower}`);

    const newOpponentHealth = Math.max(game.opponentHealth - userAttackPower, 0);
    const newUserHealth = Math.max(game.userHealth - opponentAttackPower, 0); // Simulating opponent's attack

    console.log(`Current User Health: ${game.userHealth}, New User Health: ${newUserHealth}`);
    console.log(`Current Opponent Health: ${game.opponentHealth}, New Opponent Health: ${newOpponentHealth}`);

    db.run(
      "UPDATE games SET userHealth = ?, opponentHealth = ? WHERE gameId = ?",
      [newUserHealth, newOpponentHealth, gameId],
      function (err) {
        if (err) {
          console.error("Error updating game health:", err);
          return res.status(500).json({ message: "Error updating game health", error: err.message });
        }
        res.json({
          message: "Attack successful",
          userHealth: newUserHealth,
          opponentHealth: newOpponentHealth,
        });
      }
    );
  });
});