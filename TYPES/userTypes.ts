
export default interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    avatar: string;
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;

}