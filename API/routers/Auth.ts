import express, {Router,  Express, Request, Response } from "express";
import User from "../../TYPES/userTypes";
import UserService from "../data/user";
import { env } from "process";
import { redisInstance } from "../data/redis";
import { Bcrypt } from "../data/bcrypt";
import TokenUtil from "../../Util/Token";

const { body, validationResult, header } = require("express-validator");

const bCrypt = new Bcrypt(); // Bcrypt class
const tokenUtil = new TokenUtil(); // TokenUtil class

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
        password: await bCrypt.hashPassword(password),
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

    // generate tokens
    const accessToken = tokenUtil.generateAccessToken(user.id);
    const refreshToken = tokenUtil.generateRefreshToken(user.id);

    

    res.status(201).json({
        user: user,
        accessToken,
        refreshToken,
    });
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

    const passwordMatch = await bCrypt.comparePassword(password, user.password);
    if (!passwordMatch) {
        res.status(401).json({ error: "Invalid password." });
        return;
    }

    // generate tokens
    const accessToken = tokenUtil.generateAccessToken(user.id);
    const refreshToken = tokenUtil.generateRefreshToken(user.id);

    res.status(200).json({
        user: user,
        accessToken,
        refreshToken,
    });

    return;
});

module.exports = router;