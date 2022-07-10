require('dotenv').config();
const Player = require("../models/player");
const redis = require('redis');

async function getPlayer(req, res, next) {
    let player;
    try {
        const client = redis.createClient({
            url: process.env.REDIS_ENDPOINT + "",
            password:  process.env.REDIS_PASSWORD + ""
        });
        client.on('error', (err) => console.log('Redis Client Error', err));
        await client.connect();
        let player = client.get(req.params.id);
        player = JSON.parse(player);
        if(!player){
            player = await Player.findById(req.params.id);
            client.setEx(req.params.id, 3600, JSON.stringify(player));
        }
        if (player == null)
            return res.status(404).setHeader("Content-Type", "application/json").json({ message: 'player not found :(' });
    } catch (err) {
        return res.status(500).setHeader("Content-Type", "application/json").json({ message: err.message });
    }

    res.player = player;
    next();
}

module.exports = getPlayer;
