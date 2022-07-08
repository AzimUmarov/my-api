require('dotenv').config();
const jwt = require("jsonwebtoken");
const redis = require('redis');

async function authUser(req, res, next) {
    // const authHeader = req.headers['authorization'];
    const token = req.headers["authorization"];
    //const token = authHeader && authHeader.split(" ")[1];

    if (token === null) return res.sendStatus(401);
    const client = redis.createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();
    let validToken = await client.get(token);
    console.log(validToken);

    if(validToken === token){
        next();
        return 0;
    }


    res.setHeader("Content-Type", "application/json").status(401).json({message: "non authorized"});

}

module.exports = authUser;
