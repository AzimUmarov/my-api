require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const players = require("./routes/playersRouter");
const jwt = require('jsonwebtoken');
const authUser = require("./middlewares/authUser");

const users = [
    {
        username: "azim",
        password: "4444",
        token: "t42854t54t65t54t56t56t5r6tr56"
    },
    {
        username: "John",
        password: "12234",
        token: "egrugreguf47354674t3"
    }
];


mongoose.connect(process.env.MONGO_URL_NBA, {
    useNewUrlParser: true
});

const db = mongoose.connection;


db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected to db"));

app.use(express.json());

app.get("/id", authUser, (req, res) => {
    res.send(req.body.username + " ok");
});

app.post("/login", (req, res) => {
    const user = {username: req.body.username, password: req.body.password};
    if(users.find((item) => (item.username===user.username && item.password===user.password))) {
        jwt.sign(user, process.env.SECRET_KEY, (err, token) => {
            res.json({token: token});
        });
        return;
    }

    res.status(401).json({message: "Not authorized"});

});

app.post("/register", async (req, res) => {
    const user = {username: req.body.username, password: req.body.password};
    console.log(user);
    //we can add validation like that
    if(user.username.length < 3 || user.password.length < 4) {
        res.status(400).json({message: "User data not valid :)"});
        return;
    }
    if(users.find((item) => (item.username===user.username))) {
        res.status(400).json({message: "User already exist login via /login path :)"});
        return;
    }
    console.log("validation ended");

    await jwt.sign(user, user.password,  (err, token) => {
        user.token = token;
    });

     console.log(user.token);
     if(user.token) {
        users.push(user);
         jwt.sign(user, user.token, (err, token) => {
             res.status(200).json({message: "user created",token: token});
         });
    }

});

app.use("/players", authUser, players);

app.listen(8080, () => {
    console.log("Server started");
})
