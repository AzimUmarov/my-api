const serverless = require("serverless-http");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const players = require("./routes/playersRouter");
const db = mongoose.connection;
app.use(express.json());

mongoose.connect("mongodb+srv://azim:4444@cluster0.mdf4u.mongodb.net/nba_players?retryWrites=true&w=majority", {
  useNewUrlParser: true
});

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to db"));

app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from root!",
  });
});

app.use("/players", players);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
