export interface AIUser {
    id: string;
    name: string;
    avatar: string;
    gamesplayed: number;
    gamesWon: number;
    gamesLost: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    avatar: string;
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;

}

export type LobbyStatus = 'waiting' | 'prompt' | 'voter' | 'finished';

export interface Prompt {
    id: string;
    question: string;
} 

export interface Answer {
    id: string;
    answer: string;
    user: User | AIUser;
    question: Prompt;
    lobby: Lobby;
}

export interface Vote {
    id: string;
    votesFor: Answer;
    user: User;
}

export interface LobbyRound {
    id: string;
    round: number;
    question: Prompt;
    answers: Answer[];
    lobby: Lobby;
    votes: Vote[];

}

export interface Lobby {
    id: string;
    users: User[];
    aiUser: AIUser;
    rounds: LobbyRound[];
    host: User;
}



/** class to store a static list of all public lobbies, 
 * this class will be used for public matchmaking
 * create methods to join a lobby, create a lobby, 
 * start a game, create a prompt, submit answers, and submit vote
 */
export default class Lobbys {
    private static instance: Lobbys;
    private lobbies: Lobby[] = [];
    private privateLobbies: Lobby[] = [];
    private static readonly USER_LIMIT = 9; 


    // ai user
    private static readonly AI_USER: AIUser = {
        id: `ai:${Date.now()}`,
        name: "AI",
        avatar: "https://example.com/ai-avatar.png", // Placeholder for AI avatar
        gamesWon: 0,
        gamesLost: 0,
        gamesplayed: 0,
    };
    private static readonly AI_USER_LIMIT = 1; // Limit for AI users in a lobby

    private constructor() {}

    public static getInstance(): Lobbys {
        if (!Lobbys.instance) {
            Lobbys.instance = new Lobbys();
        }
        return Lobbys.instance;
    }

    public getLobbies(): Lobby[] {
        return this.lobbies;
    }

    public addLobby(lobby: Lobby): void {
        this.lobbies.push(lobby);
    }

    public removeLobby(lobbyId: string): void {
        this.lobbies = this.lobbies.filter(lobby => lobby.id !== lobbyId);
    }

    public getLobbyById(lobbyId: string): Lobby | undefined {
        return this.lobbies.find(lobby => lobby.id === lobbyId);
    }

    public getAllLobbies(): Lobby[] {
        return this.lobbies;
    }

    public removeUserFromLobby(userId: string): void {
        this.lobbies = this.lobbies.map(lobby => {
            lobby.users = lobby.users.filter(user => user.id !== userId);
            return lobby;
        });
    }

    public getUserInLobby(lobbyId: string, userId: string): User | undefined {
        const lobby = this.lobbies.find(l => l.id === lobbyId);
        if (!lobby) return undefined;
        return lobby.users.find(user => user.id === userId);
    }

    public createLobby(user: User, lobbyId: string): Lobby {
        const lobby: Lobby = {
            id: lobbyId,
            users: [user],
            aiUser: Lobbys.AI_USER,
            rounds: [],
            host: user,
        };
        this.lobbies.push(lobby);
        return lobby;
    }

    public joinLobby(user: User, lobbyId?: string): Lobby | undefined {
        if (!lobbyId) { // public matchmaking
            let lobby = this.lobbies[this.lobbies.length - 1];
            if (!lobby || lobby.users.length >= Lobbys.USER_LIMIT) {
                lobby = this.createLobby(user, `lobby:${Date.now()}`);
            } else {
                lobby.users.push(user);
            }
            return lobby;
        } else {
            // TODO: add private lobby logic
            return undefined;
        }
    }

    public createPrompt(lobbyId: string) : Prompt | undefined {
        const lobby = this.lobbies.find(l => l.id === lobbyId);
        if (!lobby) return undefined;
        const prompt: Prompt = {
            id: `prompt:${Date.now()}`,
            question: "What is your favorite color?",
        };
        lobby.rounds.push({
            id: `round:${Date.now()}`,
            round: lobby.rounds.length + 1,
            question: prompt,
            answers: [],
            lobby: lobby,
            votes: [],
        });
        return prompt;
    }

    public startGame(lobbyId: string): void {
        const lobby = this.lobbies.find(l => l.id === lobbyId);
        if (!lobby) return;
        this.createPrompt(lobbyId);
    }

    public submitAnswer(lobbyId: string, userId: string, answer: string): void {
        const lobby = this.lobbies.find(l => l.id === lobbyId);
        if (!lobby) return;
        const user = lobby.users.find(u => u.id === userId);
        if (!user) return;
        const round = lobby.rounds[lobby.rounds.length - 1];
        const answerObj: Answer = {
            id: `answer:${Date.now()}`,
            answer: answer,
            user: user,
            question: round.question,
            lobby: lobby,
        };
        round.answers.push(answerObj);

        // check if all users have submitted answers
        if (round.answers.length === lobby.users.length) {
            // move to voting phase
            // send vote packet to all users
            console.log("All users have submitted answers, moving to voting phase.");
        }
    }

    public submitVote(lobbyId: string, userId: string, answerId: string): void {
        const lobby = this.lobbies.find(l => l.id === lobbyId);
        if (!lobby) return;
        const user = lobby.users.find(u => u.id === userId);
        if (!user) return;
        const round = lobby.rounds[lobby.rounds.length - 1];
        const answer = round.answers.find(a => a.id === answerId);
        if (!answer) return;
        const vote: Vote = {
            id: `vote:${Date.now()}`,
            votesFor: answer,
            user: user,
        };
        round.votes.push(vote);

        // check if all users have voted
        if (round.votes.length === lobby.users.length) {
            // move to next round
            console.log("All users have voted, moving to next round.");

            // end game logic
            if (lobby.rounds.length >= 3) {
                console.log("Game over, all rounds completed.");
                this.removeLobby(lobbyId);
                return;
            }


            this.createPrompt(lobbyId);
        }
    }


}

// game loop
function gameLoop() {

    // create 9 users 
    const users: User[] = [];
    for (let i = 0; i < 9; i++) {
        users.push({
            id: `user:${i}`,
            name: `User ${i}`,
            avatar: "https://example.com/avatar.png",
            email: "",
            gamesPlayed: 0,
            gamesWon: 0,
            gamesLost: 0,
        });
    }

    const host: User = users[0];

    // create lobby
    const lobby = Lobbys.getInstance().joinLobby(host);

    console.log("Lobby created:", lobby);

    // have all other users join lobby
    for (let i = 1; i < users.length; i++) {
        const user = users[i];
        const lobby = Lobbys.getInstance().joinLobby(user);
        console.log("User joined lobby:", user.name, lobby);
    }

    // start game
    Lobbys.getInstance().startGame(lobby!.id);

    for (let r = 0; r < 3; r++) {
        console.log(`submitting answers for prompt: ${lobby!.rounds[r].question.question}`);

        // submit answers for all users
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const answer = `Answer ${i}`;
            Lobbys.getInstance().submitAnswer(lobby!.id, user.id, answer);
            console.log("User submitted answer:", user.name, answer);
        }
        console.log("All users have submitted answers, moving to voting phase.");
        // submit votes for all users
        for (let i = 0; i < users.length; i++) {
            const user = users[r];
            const answer = lobby!.rounds[r].answers[i];
            Lobbys.getInstance().submitVote(lobby!.id, user.id, answer.id);
            console.log("User submitted vote:", user.name, answer.answer);
        }

        console.log("All users have voted, moving to next round.");

    }
}