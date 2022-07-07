require('dotenv').config();
const jwt = require("jsonwebtoken");

function authUser(req, res, next) {
    // const authHeader = req.headers['authorization'];
    const token = req.headers["authorization"];
    //const token = authHeader && authHeader.split(" ")[1];

    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY +
        "", (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = authUser;
