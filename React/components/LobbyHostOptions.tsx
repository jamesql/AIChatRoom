import React from 'react';
import ApiClient from '@/util/api';
import Cookies from 'js-cookie';

export interface LobbyHostOptionsProps {
    lobbyId: string;
};


const LobbyHostOptions: React.FC<LobbyHostOptionsProps> = ({ lobbyId }) => {



    const handleStartGame = () => {
        // Logic to start the game
        console.log("Starting game...");
        const accessToken = Cookies.get("accessToken");

        if (!accessToken) {
            console.error("Access token not found");
            return;
        }

        // call api
        ApiClient.getInstance().startGame(accessToken, lobbyId);
    };



    return (
        <div className="lobby-host-options">
            <button onClick={handleStartGame} className="start-game-button">
                Start Game
            </button>
            <button className="end-lobby-button">
                End Lobby
            </button>
        </div>
    );
};

export default LobbyHostOptions;