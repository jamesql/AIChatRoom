import { Answer, Lobby, Prompt, Vote } from "./lobbyTypes";
import User from "./userTypes";

export interface UserSession {
    user: User;
    isInLobby: boolean;
    lobbyId: string | null;
    isHost: boolean;
    isInGame: boolean;
    isInPublicMatchmaking: boolean;
}

export const OPCodes = {
    HELLO: 0,
    HEARTBEAT: 1,
    AUTH: 2,
    READY: 3,
    CREATE_LOBBY: 4, // Create a new game lobby
    JOIN_LOBBY: 5, // Join an existing game lobby
    PUBLIC_MATCHMAKING: 6, // Join public matchmaking
    START_GAME: 7, // Start the game
    PROMPT: 8, // Send a prompt to the players
    SUBMIT_PROMPT_RESPONSE: 9, // Submit a response to a prompt
    VOTE_RESPONSE: 10, // Vote on a response
    END_GAME: 11, // End the game
    GAME_STATE_UPDATE: 12, // Update game state for all players
    LOBBY_USER_JOIN: 13,
    LOBBY_USER_LEAVE: 14,
    ALL_ANSWERS: 15,
    BEGIN_VOTING: 16,
    SUBMIT_VOTE_RESPONSE: 18,
    ALL_VOTES: 19,
    VOTE_RESULT: 20,
    VOTED_OUT: 21,
};

export type OPCode = typeof OPCodes[keyof typeof OPCodes];

export interface HelloPacket {
    op: OPCode;
    d: {
        heartbeatInterval: number; // Heartbeat interval in milliseconds
    }
}

export interface HeartbeatPacket {
    op: OPCode;
    d: {
        sq: number;
    }
}

export interface AuthPacket {
    op: OPCode;
    d: {
        token: string; // JWT token for authentication
    }
}

export interface ReadyPacket {
    op: OPCode;
    d: {
        user: User; // User information
    }
}

export interface CreateLobbyPacket {
    op: OPCode;
    d: {
        lobbyId: string; // ID of the created lobby
        user: User; // User information
    }
}

export interface JoinLobbyPacket {
    op: OPCode;
    d: {
        lobby: Lobby; // ID of the lobby to join
        user: User; // User information
    }
}

export interface PublicMatchmakingPacket {
    op: OPCode;
    d: {
        lobby: Lobby;
    }
}

export interface StartGamePacket {
    op: OPCode;
    d: {
        lobby: Lobby; // ID of the lobby to start
    }
}

export interface PromptPacket {
    op: OPCode;
    d: {
        prompt: Prompt; // Prompt question
        lobby: Lobby; // ID of the lobby
    }
}

export interface SubmitPromptResponsePacket {
    op: OPCode;
    d: {
        prompt: Prompt;
        answer: Answer; // User's answer to the prompt
    }
}

export interface VoteResponsePacket {
    op: OPCode;
    d: {
        lobby: Lobby;
        votes: Vote[];
    }
}

export interface EndGamePacket {
    op: OPCode;
    d: {
        lobby: Lobby; // ID of the lobby
    }
}

export interface GameStateUpdatePacket {
    op: OPCode;
    d: {
        lobby: Lobby; // Updated game state
    }
}

export interface LobbyUserJoinPacket {
    op: OPCode;
    d: {
        user: User;
    }
}

export interface LobbyUserLeavePacket {
    op: OPCode;
    d: {
        user: User;
    }
}