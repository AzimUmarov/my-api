require('dotenv').config();
const redis = require('redis');

async function authUser(req, res, next) {
    //const authHeader = req.headers['authorization'];
    //const token = authHeader && authHeader.split(" ")[1];
    const token = req.headers["authorization"];

    if (token === null)
        return  res.sendStatus(401);

    const client = redis.createClient({
        url: process.env.REDIS_ENDPOINT + "",
        password:  process.env.REDIS_PASSWORD + ""
    });
    client.on('error', (err) => console.log('Redis Client Error', err));
    await client.connect();

    let validToken = await client.get(token || "null");

    if(validToken === token)
        return next();

    res.setHeader("Content-Type", "application/json").status(401).json({message: "non authorized"});
}

module.exports = authUser;
