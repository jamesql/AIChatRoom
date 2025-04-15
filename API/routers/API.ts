import express, {Router,  Express, Request, Response } from "express";
const { body, validationResult, header } = require("express-validator");
import { validateToken } from "../data/token";
import { redisInstance } from "../data/redis";
import {User, Lobby, LobbyRound, LobbyStatus, Socket, Prompt, Answer, AIUser} from "../../TYPES/types";
import UserService from "../data/user";
import LobbyManager from "../data/lobbys";
import { JoinLobbyPacket, OPCodes, PromptPacket, SubmitPromptResponsePacket } from "../../TYPES/socketTypes";
import OpenAIClient from "../data/openaiclient";

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

    redisInstance.publish(`user:${userId}:events`, JSON.stringify({
        op: OPCodes.JOIN_LOBBY,
        d: {
            lobby: lobby,
            user: user,
        },
    } as JoinLobbyPacket));

    lobby.users.forEach((u) => {
        if (u.id === userId) return;
        redisInstance.publish(`user:${u.id}:events`, JSON.stringify({
            op: OPCodes.LOBBY_USER_JOIN,
            d: {
                lobby: lobby,
                user: u,
            },
        } as JoinLobbyPacket));
    });

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

    redisInstance.publish(`user:${userId}:events`, JSON.stringify({
        op: OPCodes.JOIN_LOBBY,
        d: {
            lobby: lobby,
            user: user,
        },
    } as JoinLobbyPacket));

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

    // send prompt to players
    lobby.users.forEach((u) => {
        redisInstance.publish(`user:${u.id}:events`, JSON.stringify({
            op: OPCodes.PROMPT,
            d: {
                prompt: lobby.rounds[lobby.rounds.length - 1].question,
                lobby: lobby,
            },
        } as PromptPacket));
    });

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

    redisInstance.publish(`user:${userId}:events`, JSON.stringify({
        op: OPCodes.SUBMIT_PROMPT_RESPONSE,
        d: {
            prompt: prompt,
            answer: answer,
            lobby: lobby,
        },
    } as SubmitPromptResponsePacket));


    if (lobby.rounds[lobby.rounds.length - 1].answers.length === lobby.users.length) {

        // create ai answer
        const aiAnswer = await OpenAIClient.generateResponse(lobby.rounds[lobby.rounds.length - 1].question.question);
        console.log("AI answer: ", aiAnswer);
        let aia: Answer = {
            // generate id
            id: lobbyManager.generateId(),
            answer: aiAnswer,
            user: lobby.aiUser,
            question: lobby.rounds[lobby.rounds.length - 1].question,
            lobbyId: lobby.id,
        }

        lobby.rounds[lobby.rounds.length - 1].answers.push(aia);

        redisInstance.publish(`user:${lobby.host.id}:events`, JSON.stringify({
            op: OPCodes.ALL_ANSWERS,
            d: {
                lobby: lobby,
            }
        }));
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

    // send answers to players
    lobby.users.forEach((u) => {
        redisInstance.publish(`user:${u.id}:events`, JSON.stringify({
            op: OPCodes.BEGIN_VOTING,
            d: {
                lobby: lobby,
                answers: lobby.rounds[lobby.rounds.length - 1].answers,
            },
        }));
    });

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

    redisInstance.publish(`user:${userId}:events`, JSON.stringify({
        op: OPCodes.SUBMIT_VOTE_RESPONSE,
        d: {
            answerId: answerId,
            lobby: lobby,
        },
    }));

    if (lobby.rounds[lobby.rounds.length - 1].votes.length === lobby.users.length) {

        redisInstance.publish(`user:${lobby.host.id}:events`, JSON.stringify({
            op: OPCodes.ALL_VOTES,
            d: {
                lobby: lobby,
            }
        }));
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

    // send results to players
    lobby.users.forEach((u) => {
        redisInstance.publish(`user:${u.id}:events`, JSON.stringify({
            op: OPCodes.VOTE_RESULT,
            d: {
                lobby: lobby,
            }
        }));
    });

    // return the lobby information
    res.status(200).json({
        lobby: lobby,
    });
});

router.post("/start-new-round", [
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
    const lobby = lobbyManager.startNewRound(lobbyId, user.id);
    if (!lobby) {
        res.status(500).json({ error: "Failed to start new round" });
        return;
    }

    // send prompt to players
    lobby.users.forEach((u) => {
        redisInstance.publish(`user:${u.id}:events`, JSON.stringify({
            op: OPCodes.PROMPT,
            d: {
                prompt: lobby.rounds[lobby.rounds.length - 1].question,
                lobby: lobby,
            },
        } as PromptPacket));
    });

    // return the lobby information
    res.status(200).json({
        lobby: lobby,
    });
});


router.get("/getUserData", [
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

    // return the user information
    res.status(200).json({
        user
    });
}
)






module.exports = router;