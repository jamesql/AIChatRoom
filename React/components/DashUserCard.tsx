import React from 'react';
import classes from "../styles/dashusercard.module.css";

interface DashUserCardProps {
    name: string;
    avatarUrl?: string;
}

const DashUserCard: React.FC<DashUserCardProps> = ({ name, avatarUrl }) => {
    return (
        <div className={classes.dash_user_card}>
            <div className={classes.avatar}>
                {avatarUrl ? (
                    <img src={avatarUrl} alt={`${name}'s avatar`} />
                ) : (
                    <div className="placeholder-avatar">{name.charAt(0).toUpperCase()}</div>
                )}
            </div>
            <div className={classes.user_info}>
                <h1>Welcome, {name}!</h1>
                <p>Lorem ipsum</p>
            </div>
            <button>
                <a href="/play">Join a Lobby</a>
            </button>
        </div>
    );
};

export default DashUserCard;