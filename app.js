const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const players = require("./routes/playersRouter");

mongoose.connect(process.env.DATABASE_URL, {
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
