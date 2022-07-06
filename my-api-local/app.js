const express = require("express");
const app = express();
const mongoose = require("mongoose");
const players = require("./routes/playersRouter");

mongoose.connect("mongodb+srv://azim:4444@cluster0.mdf4u.mongodb.net/nba_players?retryWrites=true&w=majority", {
    useNewUrlParser: true
});

const db = mongoose.connection;


db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to db"));

app.use(express.json());


app.use("/players", players);

app.listen(8080, () => {
    console.log("Server started");
})
