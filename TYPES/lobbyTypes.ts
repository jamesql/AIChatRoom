import AIUser from "./aiTypes";
import User from "./userTypes";

export type LobbyStatus = "lobby" | "prompt" | "waiting_answers" | "voting" | "waiting_voting" | "next_round" | "ai_win" | "user_win";

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
    lobbyId: string;
    votes: Vote[];

}

export interface Lobby {
    id: string;
    users: User[];
    aiUser: AIUser;
    rounds: LobbyRound[];
    host: User;
    inGame: boolean;
    status: LobbyStatus;
}

