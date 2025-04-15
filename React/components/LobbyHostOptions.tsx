import React from 'react';
import ApiClient from '@/util/api';
import Cookies from 'js-cookie';
import classes from "../styles/lobbyhostoptions.module.css";

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
        ApiClient.getInstance().startGame(accessToken, lobbyId).catch((err) => {
            if (err.response && err.response.status === 500) {
                alert("You need a minimum of 2 players to start.");
            }
        });
    };



    return (
        <div className={classes.lobby_host_options}>
            <button onClick={handleStartGame} className={classes.start_game_button}>
                Start Game
            </button>
            <button className={classes.end_lobby_button}>
                End Lobby
            </button>
        </div>
    );
};

export default LobbyHostOptions;