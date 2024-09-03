require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const gameRoutes = require("./routes/gameRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1", userRoutes);
app.use("/api/v1", gameRoutes);

app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is runing on http://localhost:${PORT}`);
});

module.exports = app;
