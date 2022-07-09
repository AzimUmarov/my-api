require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const players = require("./routes/playersRouter");
const authUser = require("./routes/authRouter");
const authUsers = require("./middlewares/authUser")
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to the db nba_player "));


app.use("/players", authUsers, players);
app.use("/", authUser);

app.listen(process.env.PORT, (err) => {
    if(err){
        console.log(e.message);
        return 0;
    }
    console.log(`Server started on port ${process.env.PORT}`);
})
