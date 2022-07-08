const MongoClient = require('mongodb').MongoClient;
const express = require("express");
const User = require("./models/user");
const app = express();

const Redis = require("redis");

let redisClient;

(async () => {
    redisClient = Redis.createClient();

    redisClient.on('error', (err) => console.log('Redis Client Error', err));

    await redisClient.connect();

    await redisClient.set('key', 'value');

})();

app.listen(8000, ()=> console.log("OK"));
