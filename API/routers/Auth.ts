import express, {Router,  Express, Request, Response } from "express";
import User from "../../TYPES/userTypes";
import UserService from "../data/user";
import { env } from "process";
import { redisInstance } from "../data/redis";
import { UserSession } from "../../TYPES/socketTypes";
const { body, validationResult, header } = require("express-validator");

const bcrypt = require("bcrypt");

const router: Router = express.Router();

router.post("/register", [
    body("username").isString().isLength({ min: 3, max: 20 }),
    body("password").isString().isLength({ min: 8, max: 20 }),
    body("email").isEmail(),
    body("avatar").isString().isLength({ min: 3, max: 20 }),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { username, password, email, avatar } = req.body;
    const user: User = await UserService.createUser({
        name: username,
        password: await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS),
        email,
        avatar,
        gamesPlayed: 0,
        gamesWon: 0,
        gamesLost: 0,
    });

    if (!user || !user.id) {
        res.status(500).json({ error: "Failed to create user." });
        return;
    }

    res.status(201).json(user);
    return;
}); 

router.post("/login", [
    body("username").isString(),
    body("password").isString(),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { username, password } = req.body;
    const user: User | null = await UserService.getUserByUsername(username);

    if (!user || !user.id) {
        res.status(404).json({ error: "User not found." });
        return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        res.status(401).json({ error: "Invalid password." });
        return;
    }

    redisInstance.set(`user:${user.id}`, JSON.stringify({
        user: user,
        isInLobby: false,
        isHost: false,
        isInGame: false,
        isInPublicMatchmaking: false,
        lobbyId: null,

    } as UserSession));

    res.status(200).json(user);
    return;
});

module.exports = router;