const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user")
const redis = require('redis');
const authUser = require("../middlewares/authUser");


router.post("/login", async (req, res) => {
    const user = {username: req.body.username, password: req.body.password};

    if(user.username.length < 3 || user.password.length < 4){
        res.setHeader("Content-Type", "application/json").status(403).json({message: "Invalid user data"});
        return;
    }

    const existingUser = await User.find({username: user.username});

    if(!existingUser[0]){
        res.setHeader("Content-Type", "application/json").status(401).json({message: "User not found"});
        return;
    }
    console.log(existingUser);
    await jwt.verify(existingUser[0].password,user.password, (err, user) => {
        if (err) {
            res.setHeader("Content-Type", "application/json").status(403).json({message: "password isn't correct, please try again!"});
            return 0;
        }
    });

    try {
        await jwt.sign(user, user.password, async (err, token) => {
            const client = redis.createClient();
            client.on('error', (err) => console.log('Redis Client Error', err));
            await client.connect();
            await client.set(token, token);
            res.setHeader("Content-Type", "application/json").status(200).json({token: token});
            return 0;
        });
    }
    catch (err){
        res.status(500).json({message: err.message});
    }
});

router.post("/register", async (req, res) => {
    const tempUser = {username: req.body.username, password: req.body.password};
    const client = redis.createClient();
    //we can add validation like that
    if(tempUser.username.length < 3 || tempUser.password.length < 4) {
        res.status(400).json({message: "User data not valid :)"});
        return;
    }

    const existingUser = await User.find({username: tempUser.username});

    if(existingUser[0]) {
        res.status(400).json({message: "User already exist login via /login path :)"});
        return;
    }

    console.log("validation ended");
    let passToken = await jwt.sign({ foo: 'bar' }, tempUser.password);


    console.log(passToken);
    if(passToken) {
        const user = new User({username: tempUser.username, password: passToken});
        await user.save().catch(err => console.log(err.message));

        jwt.sign(tempUser, tempUser.password, async (err, token) => {
            if(err){
                res.status(403).json({message: "error while generating token"});
            }
            client.on('error', (err) => console.log('Redis Client Error', err));
            await client.connect();
            await client.set(token, token);
            res.status(200).json({message: "user created",token: token});
        });
    }

});

router.get("/logout", authUser, async (req, res) => {
    const token = req.headers["authorization"];
    const client = redis.createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
    try {
        await client.del(token);
        res.status(200).json({message: "signet out"});
    }
    catch (e){
        res.status(500).json({message: e.message});
    }
});

module.exports = router;
