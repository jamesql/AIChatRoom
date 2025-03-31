import AIUser from "./aiTypes";
import User from "./userTypes";

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

