import express, {Router,  Express, Request, Response } from "express";
const { body, validationResult, header } = require("express-validator");
import { validateToken } from "../data/token";
import { redisInstance } from "../data/redis";
import {User, Lobby, LobbyRound, LobbyStatus, Socket, Prompt, Answer, AIUser} from "../../TYPES/types";
import UserService from "../data/user";
import { UserSession } from "../../TYPES/socketTypes";

const router: Router = express.Router();

// Route to create a private game
router.post("/create-game", [
    header("Authorization").isString(),
    body("gameName").isString().isLength({ min: 3, max: 20 }),
], async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const token = req.headers["authorization"];
        const result = await validateToken(token as string);
        if (!result || !result.valid) {
            res.status(401).json({ error: "Invalid token." });
            return;
        }
        const userId = result.userId;
        const gameName = req.body.gameName;

        const user = await UserService.getUserById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        // Check if the user already has a private game
        const redisData = await redisInstance.get(`user:${userId}`);
        if (!redisData) {
            res.status(404).json({ error: "User session not found." });
            return;
        }
        const session: UserSession = JSON.parse(redisData);

        // Create a private game lobby
        const lobbyId = `lobby:${userId}:${gameName}`;
        const lobby = {
            id: lobbyId,
            name: gameName,
            owner: userId,
            players: [userId],
            status: "WAITING" as LobbyStatus,
        };

        // If the user already has a private game, return an error
        if (session.isInLobby) {
            res.status(400).json({ error: "User already has a game." });
            return;
        }


        // Save the lobby to Redis
        await redisInstance.set(lobbyId, JSON.stringify(lobby));

        // Update the user session
        session.isInLobby = true;
        session.lobbyId = lobbyId;
        session.isHost = true;
        session.isInGame = false;
        session.isInPublicMatchmaking = false;
        await redisInstance.set(`user:${userId}`, JSON.stringify(session));
        await redisInstance.set(`lobby:${lobbyId}`, JSON.stringify(lobby));


        res.status(200).json({ message: "Private game created.", lobby });
        return;
    } catch (error) {
        console.error("Error creating game:", error);
        res.status(500).json({ error: "Internal server error." });
        return;
    }
});

// Route to join public matchmaking
router.post("/join-matchmaking", [
    header("Authorization").isString(),
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const token = req.headers["authorization"];
    const result = await validateToken(token as string);
    if (!result || !result.valid) {
        res.status(401).json({ error: "Invalid token." });
        return;
    }
    const userId = result.userId;
    const redisData = await redisInstance.get(`user:${userId}`);
    if (!redisData) {
        res.status(404).json({ error: "User session not found." });
        return;
    }
    const session: UserSession = JSON.parse(redisData);
    if (session.isInPublicMatchmaking || session.isInLobby || session.isInGame) {
        res.status(400).json({ error: "User already in public matchmaking." });
        return;
    }


});




module.exports = router;