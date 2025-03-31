import React from 'react';
import classes from '../styles/currentplayers.module.css';

interface Player {
    name: string;
}

interface CurrentPlayersProps {
    players: Player[];
}

const CurrentPlayers: React.FC<CurrentPlayersProps> = ({ players }) => {
    return (
        <div className={classes.container}>
            <h2 className={classes.title}>Current Players</h2>
            <ul className={classes.playerList}>
                {players.map((player, index) => (
                    <li key={index} className={classes.playerItem}>
                        {player.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CurrentPlayers;