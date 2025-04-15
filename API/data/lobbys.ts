import AIUser from "../../TYPES/aiTypes";
import {Answer, Lobby, Prompt, Vote} from "../../TYPES/lobbyTypes";
import { OPCodes } from "../../TYPES/socketTypes";
import User from "../../TYPES/userTypes";
import { getRandomPrompt } from "./prompts";
import { redisInstance } from "./redis";

class LobbyManager {
    private static instance: LobbyManager;
    private static lobbys: Lobby[] = [];
    private readonly MAX_PLAYERS: number = 9;

    private constructor() {}

    public static getInstance(): LobbyManager {
        if (!LobbyManager.instance) {
            LobbyManager.instance = new LobbyManager();
        }
        return LobbyManager.instance;
    }

    public joinMatchmaking(User: User): Lobby {
        const newestLobby = LobbyManager.lobbys[LobbyManager.lobbys.length - 1];
        if (newestLobby && newestLobby.users.length < this.MAX_PLAYERS && !newestLobby.inGame) {
            newestLobby.users.push(User);
            return newestLobby;
        }
        const newLobby: Lobby = {
            id: this.generateId(),
            users: [User],
            aiUser: this.createAiUser(),
            rounds: [],
            host: User,
            inGame: false,
            status: "lobby"
        };

        LobbyManager.lobbys.push(newLobby);
        return newLobby;
    }

    public joinLobby(User: User, lobbyId: string): Lobby | null {
        const lobby = LobbyManager.lobbys.find(lobby => lobby.id === lobbyId);
        if (!lobby || lobby.users.length >= this.MAX_PLAYERS || lobby.inGame) {
            return null;
        }
        lobby.users.push(User);
        return lobby;
    }

    public leaveLobby(User: User, lobbyId: string): Lobby | null {
        const lobby = LobbyManager.lobbys.find(lobby => lobby.id === lobbyId);
        if (!lobby) {
            return null;
        }
        const userIndex = lobby.users.findIndex(u => u.id === User.id);
        if (userIndex === -1) {
            return null;
        }
        lobby.users.splice(userIndex, 1);
        if (lobby.users.length === 0) {
            const lobbyIndex = LobbyManager.lobbys.findIndex(l => l.id === lobbyId);
            if (lobbyIndex !== -1) {
                LobbyManager.lobbys.splice(lobbyIndex, 1);
            }
        }   
        return lobby;
    }

    public createLobby(User: User): Lobby {
        const newLobby: Lobby = {
            id: this.generateId(),
            users: [User],
            aiUser: this.createAiUser(),
            rounds: [],
            host: User,
            inGame: false,
            status: "lobby"
        };
        LobbyManager.lobbys.push(newLobby);
        return newLobby;
    }

    public startLobby(lobbyId: string, host: User): Lobby {
        const lobby = LobbyManager.lobbys.find(lobby => lobby.id === lobbyId);
        if (!lobby || lobby.host.id !== host.id || lobby.inGame) {
            throw new Error("Cannot start the lobby");
        }
        lobby.inGame = true;
        const question: Prompt = {
            id: this.generateId(),
            question: getRandomPrompt(),
        };
       
        const newRound = {
            id: this.generateId(),
            round: 1,
            question,
            answers: [],
            lobbyId: lobby.id,
            votes: [],
        };


        lobby.status = "prompt";

        lobby.rounds.push(newRound);
        return lobby;
    } 

    public addAnswer(lobbyId: string, user: User, prompt: Prompt, answer: string): Lobby | null {
        const lobby = LobbyManager.lobbys.find(lobby => lobby.id === lobbyId);
        if (!lobby) {
            return null;
        }
        // find round by prompt 
        const round = lobby.rounds.find(round => round.question.id === prompt.id);
        if (!round) {
            return null;
        }

        // check if user already answered
        const existingAnswer = round.answers.find(a => a.user.id === user.id);
        if (existingAnswer) {
            existingAnswer.answer = answer;
            return lobby;
        }

       
        const userAnswer: Answer = {
            id: this.generateId(),
            answer,
            user,
            question: prompt,
            lobbyId: lobby.id,
        };

        round.answers.push(userAnswer);
        return lobby;
    }

    public startVoting(lobbyId: string, user: User): Lobby | null {
        const lobby = LobbyManager.lobbys.find(lobby => lobby.id === lobbyId);
        if (!lobby || lobby.host.id !== user.id || lobby.rounds.length === 0) {
            return null;
        }
        const round = lobby.rounds[lobby.rounds.length - 1];
        round.votes = [];
        lobby.status = "voting";
        return lobby;
    }

    public castVote(lobbyId: string, user: User, voteFor: string): Lobby | null {
        const lobby = LobbyManager.lobbys.find(lobby => lobby.id === lobbyId);
        if (!lobby) {
            return null;
        }
        const round = lobby.rounds[lobby.rounds.length - 1];
        if (!round) {
            return null;
        }

        let votedAnswer = round.answers.find(answer => answer.id === voteFor);

        const existingVote = round.votes.find(vote => vote.user.id === user.id);
        if (existingVote) {
            existingVote.votesFor = votedAnswer;
            return lobby;
        }
        const vote: Vote = {
            id: this.generateId(),
            votesFor: votedAnswer,
            user,
        };
        round.votes.push(vote);
        return lobby;
    }

    public endVoting(lobbyId: string, user: User): Lobby | null {
        const lobby = LobbyManager.lobbys.find(lobby => lobby.id === lobbyId);
        if (!lobby || lobby.host.id !== user.id) {
            return null;
        }
        const round = lobby.rounds[lobby.rounds.length - 1];
        if (!round) {
            return null;
        }

        const votes = round.votes;
        const voteCounts = new Map<string, number>();
        votes.forEach(vote => {
            if (voteCounts.has(vote.votesFor.user.id)) {
                voteCounts.set(vote.votesFor.user.id, voteCounts.get(vote.votesFor.user.id)! + 1);
            } else {
                voteCounts.set(vote.votesFor.user.id, 1);
            }
        });
        console.log(voteCounts);

        const userWithMostVotes = Array.from(voteCounts.entries()).reduce((prev, current) => {
            return (prev[1] > current[1]) ? prev : current;
        });
        const winningAnswer = round.answers.find(answer => answer.user.id === userWithMostVotes[0]);

        if (!winningAnswer) {
            if (userWithMostVotes[0] === lobby.aiUser.id) {
                winningAnswer.user = lobby.aiUser;
            }
        }

        
        
        // Check if AI was voted out
        if (winningAnswer.user.id === lobby.aiUser.id) {
            lobby.status = "user_win";
        } else {
            // remove user from lobby 
            const userIndex = lobby.users.findIndex(u => u.id === winningAnswer.user.id);
            if (userIndex !== -1) {
                const u = lobby.users.splice(userIndex, 1);
                redisInstance.publish(`user:${u[0].id}:events`, JSON.stringify({
                    op: OPCodes.VOTED_OUT,
                    d: {

                    }
                }));
            }
            // check if AI won
            if (lobby.users.length === 1) {
                lobby.status = "ai_win";
            } else {
                lobby.status = "next_round";
            }
        }

        return lobby;
    }


    public startNewRound(lobbyId: string, userId: string): Lobby {
        const lobby = LobbyManager.lobbys.find(lobby => lobby.id === lobbyId);
        if (!lobby || lobby.host.id !== userId) {
            throw new Error("Cannot start the lobby");
        }
        lobby.inGame = true;
        const question: Prompt = {
            id: this.generateId(),
            question: getRandomPrompt(),
        };
       
        const newRound = {
            id: this.generateId(),
            round: lobby.rounds.length + 1,
            question,
            answers: [],
            lobbyId: lobby.id,
            votes: [],
        };


        lobby.status = "prompt";

        lobby.rounds.push(newRound);
        return lobby;
    } 

    


    public generateId(): string {
        return Math.random().toString(36).substring(2, 15);
    }

    public createAiUser(): AIUser {
        return {
            id: this.generateId(),
            name: "AI",
            avatar: "default_avatar.png",
            gamesplayed: 0,
            gamesLost: 0,
            gamesWon: 0,
        };
    }
}

export default LobbyManager;