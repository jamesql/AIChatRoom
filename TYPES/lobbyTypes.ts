import AIUser from "./aiTypes";
import User from "./userTypes";

export class Lobby {
    id: string;
    name: string;
    users: User[];
    AIUser: AIUser[];
    messages: Message[];
}

export class Message {
    id: string;
    user: User | AIUser;
    content: string;
    timestamp: Date;
    lobby: Lobby;
}
