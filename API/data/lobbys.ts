import { Lobby } from "../../TYPES/lobbyTypes";
import { OPCodes } from "../../TYPES/socketTypes";
import { User, Socket } from "../../TYPES/types";
import { redisInstance } from "./redis";

export default class Lobbys {
    private static readonly MAX_USERS = 9;
    private static lobbies: Lobby[] = [];

    public static joinUser(user: User): void {
        let lobby = this.lobbies.find(l => l.users.length < this.MAX_USERS);

        if (!lobby) {
            lobby = this.createNewLobby();
        }

        lobby.users.push(user);
        redisInstance.publish(`lobby:${lobby.id}`, JSON.stringify({
            op: OPCodes.JOIN_LOBBY,
            d: {
                lobby: lobby,
                user: user,
            },
        } as Socket.JoinLobbyPacket ));

        redisInstance.publish(`user:${user.id}`, JSON.stringify({
            op: OPCodes.JOIN_LOBBY,
            d: {
                lobby: lobby,
                user: user,
            },
        } as Socket.JoinLobbyPacket));

        // set user session
        redisInstance.set(`user:${user.id}`, JSON.stringify({
            isInLobby: true,
            isInPublicMatchmaking: true,
            lobbyId: lobby.id,
        } as Socket.UserSession));

        if (lobby.users.length === this.MAX_USERS) {
            this.startLobby(lobby);
            this.createNewLobby();
        }
    }

    private static startLobby(lobby: Lobby): void {
        console.log(`Starting lobby ${lobby.id} with users: ${lobby.users.map(user => user.name).join(", ")}`);
        // Logic to start the lobby game
        redisInstance.publish(`lobby:${lobby.id}`, JSON.stringify({
            op: OPCodes.START_GAME,
            d: {
                lobby: lobby,
            },
        } as Socket.StartGamePacket));
        
    }

    private static createNewLobby(): Lobby {
        console.log("Creating a new lobby...");
        // Logic to prepare for a new lobby
        return {
            id: `lobby:${Date.now()}`,
            users: [],
            aIUsers: {
                id: `ai:${Date.now()}`,
                name: "AI",
                avatar: "https://example.com/ai-avatar.png", // Placeholder for AI avatar
                gamesWon: 0,
                gamesLost: 0,
                gamesplayed: 0,
            },
            rounds: [],
        }
    }

    private static lobbyExists(lobbyId: string): boolean {
        return this.lobbies.some(lobby => lobby.id === lobbyId);
    }
    public static getLobbyById(lobbyId: string): Lobby | undefined {
        return this.lobbies.find(lobby => lobby.id === lobbyId);
    }
    public static getAllLobbies(): Lobby[] {
        return this.lobbies;
    }

    public static removeUserFromLobby(userId: string): void {
        this.lobbies = this.lobbies.map(lobby => {
            lobby.users = lobby.users.filter(user => user.id !== userId);
            return lobby;
        });
    }

}