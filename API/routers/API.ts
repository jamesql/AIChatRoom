import express, {Router,  Express, Request, Response } from "express";
const { body, validationResult, header } = require("express-validator");
import { validateToken } from "../data/token";
import { redisInstance } from "../data/redis";
import {User, Lobby, LobbyRound, LobbyStatus, Socket, Prompt, Answer, AIUser} from "../../TYPES/types";
import UserService from "../data/user";
import LobbyManager from "../data/lobbys";

const router: Router = express.Router();
const lobbyManager = LobbyManager.getInstance();

router.post("/join-matchmaking", [
    header("Authorization").exists().withMessage("Authorization header is required"),
], async(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
    }

    const token = req.headers.authorization as string;
    const result = await validateToken(token);
    if (!result || !result.valid) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }

    const userId = result.userId;
    const user = await UserService.getUserById(userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    const lobby = lobbyManager.joinMatchmaking(user);
    if (!lobby) {
        res.status(500).json({ error: "Failed to join matchmaking" });
        return;
    }

    // return the lobby information
    res.status(200).json({
        lobby: lobby,
    });
    return;
});

router.post("/join-lobby", [
    header("Authorization").exists().withMessage("Authorization header is required"),
    body("lobbyId").exists().withMessage("Lobby ID is required"),
], async(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
    }

    const token = req.headers.authorization as string;
    const result = await validateToken(token);
    if (!result || !result.valid) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }

    const userId = result.userId;
    const user = await UserService.getUserById(userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    const lobbyId = req.body.lobbyId;
    const lobby = lobbyManager.joinLobby(user, lobbyId);
    if (!lobby) {
        res.status(500).json({ error: "Failed to join lobby" });
        return;
    }

    // return the lobby information
    res.status(200).json({
        lobby: lobby,
    });
});

router.post("/leave-lobby", [
    header("Authorization").exists().withMessage("Authorization header is required"),
    body("lobbyId").exists().withMessage("Lobby ID is required"),
], async(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
    }

    const token = req.headers.authorization as string;
    const result = await validateToken(token);
    if (!result || !result.valid) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }

    const userId = result.userId;
    const user = await UserService.getUserById(userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    const lobbyId = req.body.lobbyId;
    const lobby = lobbyManager.leaveLobby(user, lobbyId);
    if (!lobby) {
        res.status(500).json({ error: "Failed to leave lobby" });
        return;
    }

    // return the lobby information
    res.status(200).json({
        lobby: lobby,
    });
});

router.post("/create-lobby", [
    header("Authorization").exists().withMessage("Authorization header is required"),
], async(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
    }

    const token = req.headers.authorization as string;
    const result = await validateToken(token);
    if (!result || !result.valid) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }

    const userId = result.userId;
    const user = await UserService.getUserById(userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    const lobby = lobbyManager.createLobby(user);
    if (!lobby) {
        res.status(500).json({ error: "Failed to create lobby" });
        return;
    }

    // return the lobby information
    res.status(200).json({
        lobby: lobby,
    });
}
);

router.post("/start-lobby", [
    header("Authorization").exists().withMessage("Authorization header is required"),
    body("lobbyId").exists().withMessage("Lobby ID is required"),
], async(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
    }

    const token = req.headers.authorization as string;
    const result = await validateToken(token);
    if (!result || !result.valid) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }

    const userId = result.userId;
    const user = await UserService.getUserById(userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    const lobbyId = req.body.lobbyId;
    const lobby = lobbyManager.startLobby(lobbyId, user);
    if (!lobby) {
        res.status(500).json({ error: "Failed to start lobby" });
        return;
    }

    // return the lobby information
    res.status(200).json({
        lobby: lobby,
    });
});

router.post("/add-answer", [
    header("Authorization").exists().withMessage("Authorization header is required"),
    body("lobbyId").exists().withMessage("Lobby ID is required"),
    body("prompt").exists().withMessage("Prompt is required"),
    body("answer").exists().withMessage("Answer is required"),
], async(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
    }

    const token = req.headers.authorization as string;
    const result = await validateToken(token);
    if (!result || !result.valid) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }

    const userId = result.userId;
    const user = await UserService.getUserById(userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    const lobbyId = req.body.lobbyId;
    const prompt = req.body.prompt;
    const answer = req.body.answer;

    const lobby = lobbyManager.addAnswer(lobbyId, user, prompt, answer);
    if (!lobby) {
        res.status(500).json({ error: "Failed to add answer" });
        return;
    }

    // return the lobby information
    res.status(200).json({
        lobby: lobby,
    });
});

router.post("/start-voting", [
    header("Authorization").exists().withMessage("Authorization header is required"),
    body("lobbyId").exists().withMessage("Lobby ID is required"),
], async(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
    }

    const token = req.headers.authorization as string;
    const result = await validateToken(token);
    if (!result || !result.valid) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }

    const userId = result.userId;
    const user = await UserService.getUserById(userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    const lobbyId = req.body.lobbyId;
    const lobby = lobbyManager.startVoting(lobbyId, user);
    if (!lobby) {
        res.status(500).json({ error: "Failed to start voting" });
        return;
    }

    // return the lobby information
    res.status(200).json({
        lobby: lobby,
    });
});

router.post("/submit-vote", [
    header("Authorization").exists().withMessage("Authorization header is required"),
    body("lobbyId").exists().withMessage("Lobby ID is required"),
    body("answerId").exists().withMessage("Answer ID is required"),
], async(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
    }

    const token = req.headers.authorization as string;
    const result = await validateToken(token);
    if (!result || !result.valid) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }

    const userId = result.userId;
    const user = await UserService.getUserById(userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    const lobbyId = req.body.lobbyId;
    const answerId = req.body.answerId;

    const lobby = lobbyManager.castVote(lobbyId, user, answerId);
    if (!lobby) {
        res.status(500).json({ error: "Failed to submit vote" });
        return;
    }

    // return the lobby information
    res.status(200).json({
        lobby: lobby,
    });
});

router.post("/end-voting", [
    header("Authorization").exists().withMessage("Authorization header is required"),
    body("lobbyId").exists().withMessage("Lobby ID is required"),
], async(req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
         res.status(400).json({ errors: errors.array() });
         return;
    }

    const token = req.headers.authorization as string;
    const result = await validateToken(token);
    if (!result || !result.valid) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }

    const userId = result.userId;
    const user = await UserService.getUserById(userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    const lobbyId = req.body.lobbyId;
    const lobby = lobbyManager.endVoting(lobbyId, user);
    if (!lobby) {
        res.status(500).json({ error: "Failed to end voting" });
        return;
    }

    // return the lobby information
    res.status(200).json({
        lobby: lobby,
    });
});






module.exports = router;