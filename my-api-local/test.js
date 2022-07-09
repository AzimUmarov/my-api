const Redis = require("redis");
require("dotenv").config();
let redisClient;

(async () => {
    redisClient = await Redis.createClient({
        url: process.env.REDIS_ENDPOINT + "",
        password:  process.env.REDIS_PASSWORD + ""
    });

    await redisClient.on('error', (err) => console.log('Redis Client Error', err));

    await redisClient.connect();

    let a = await redisClient.del("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImF6aW0iLCJwYXNzd29yZCI6IjQ0NDQiLCJpYXQiOjE2NTczODE4MjR9.gUWR9EA-FShJseot294he5Cw3nHiRq2pZncK1L2Tw7s");
    console.log(a);
})();

