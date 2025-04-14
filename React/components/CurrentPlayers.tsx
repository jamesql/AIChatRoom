import React from 'react';
import classes from '../styles/currentplayers.module.css';
import User from '../../TYPES/userTypes';


interface CurrentPlayersProps {
    players: User[];
}

const CurrentPlayers: React.FC<CurrentPlayersProps> = ({ players }) => {
    return (
        <div className={classes.container}>
            <h1 className={classes.title}>Current Players</h1>
            <ul className={classes.playerList}>
                {players.map((player, index) => (
                    <li key={index} className={classes.playerItem}>
                    <img src={player.avatar} alt={`${player.name}`} onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // prevents looping
                        target.src = "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWVweXViZDdra24xdmNubTBxZmNjY2p3bzJucGRxajdoZjRybnB1ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7VzgMsB6FLCilwS30v/giphy.gif";
                        target.alt = "Default avatar";

                    }} />
                        <span className={classes.playerName}>{player.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CurrentPlayers;