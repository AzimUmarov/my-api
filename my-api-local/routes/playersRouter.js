const express = require("express");
const router = express.Router();
const Player = require("../models/player");

//get all players
router.get('/', paginatedResults(Player),async (req, res) => {
    try {
        // const players =  await Player.find();
        res.setHeader("Content-Type", "application/json").json(res.paginatedResults);
    }
    catch (err) {
        res.status(500).setHeader("Content-Type", "application/json").json({message: err.message});
    }
});

//get one player
router.get('/:id', getPlayer, (req, res) => {
    res.json(res.player);
});

//Create one player
router.post('/', async (req, res) => {
    const player = new Player({
        Player: req.body.Player,
        height: req.body.height,
        weight: req.body.weight,
        collage: req.body.collage,
        born: req.body.born,
        birth_city: req.body.born,
        birth_state: req.body.birth_state
    });

    try {
        const newPlayer = await player.save();
        res.status(201).setHeader("Content-Type", "application/json").json(newPlayer);
    }
    catch (err) {
        res.status(400).setHeader("Content-Type", "application/json").json({message: err.message});
    }
});

//updating player
router.patch('/:id', getPlayer, async (req, res) => {
    if (req.body.Player != null) {
        res.player.Player = req.body.Player || res.player.Player;
        res.player.height = req.body.height || res.player.height;
        res.player.weight = req.body.weight || res.player.weight;
        res.player.collage = req.body.collage || res.player.collage;
        res.player.born = req.body.born || res.player.born;
        res.player.birth_city = req.body.birth_city || res.player.birth_city;
        res.player.birth_state = req.body.Player || res.player.birth_state;
    }
    try {
        const updatedPlayer = await res.player.save();
        res.setHeader("Content-Type", "application/json").json(updatedPlayer);
    } catch (err) {
        res.status(400).setHeader("Content-Type", "application/json").json({ message: err.message })
    }
});

//deleting player
router.delete('/:id', getPlayer,async (req, res) => {
    try {
        await res.player.remove();
        res.setHeader("Content-Type", "application/json").json({message: "player deleted:)"});
    }
    catch (err) {
        res.status(500).setHeader("Content-Type", "application/json").json({ message: err.message });
    }
});

async function getPlayer(req, res, next) {
    let player;
    try {
        player = await Player.findById(req.params.id);

        if (player == null)
            return res.status(404).setHeader("Content-Type", "application/json").json({ message: 'player not found :(' });
    } catch (err) {
        return res.status(500).setHeader("Content-Type", "application/json").json({ message: err.message });
    }

    res.player = player;
    next();
}

function paginatedResults(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        if(limit > 20)
            res.status(400).json({message: "Pagination limit can't be over 20"});
        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const results = {}

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec()
            res.paginatedResults = results
            next()
        } catch (e) {
            res.status(500).setHeader("Content-Type", "text/json").json({ message: e.message })
        }
    }
}

module.exports = router;
