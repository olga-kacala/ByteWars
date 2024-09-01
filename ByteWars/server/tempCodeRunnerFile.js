app.post("/api/v1/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: "Error hashing password" });

    const query = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.run(query, [username, hashedPassword], function (err) {
      if (err) {
        return res
          .status(500)
          .json({ message: "User registration failed", error: err });
      }
      res.json({
        message: "User registered successfully",
        userId: this.lastID,
      });
    });
  });
});