import React from 'react';
import classes from "../styles/dashusercard.module.css";
import { randomBio } from '@/util/randomMsgs';
import ApiClient from '@/util/api';
import Cookies from 'js-cookie';

interface DashUserCardProps {
    name: string;
    avatarUrl?: string;
}

const handleJoinPublicLobby = () => {
    // Logic to join a public lobby
    console.log("joining public lobby....");

    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
        console.error("Access token not found");
        return;
    }

    // call api
    ApiClient.getInstance().joinPublicLobby(accessToken);

}

const DashUserCard: React.FC<DashUserCardProps> = ({ name, avatarUrl }) => {
    return (
        <div className={classes.dash_user_card}>
            <div className={classes.avatar}>
                {avatarUrl ? (
                    <img src={avatarUrl} alt={`${name}'s avatar`} onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // prevents looping
                        target.src = "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWVweXViZDdra24xdmNubTBxZmNjY2p3bzJucGRxajdoZjRybnB1ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7VzgMsB6FLCilwS30v/giphy.gif";
                        target.alt = "Default avatar";

                    }} />
                ) : (
                    <div className="placeholder-avatar">{name.charAt(0).toUpperCase()}</div>
                )}
            </div>
            <div className={classes.user_info}>
                <h1>Welcome, {name}!</h1>
                <p>{randomBio()}</p>
            </div>
            <button onClick={handleJoinPublicLobby}>
                Join a Lobby
            </button>
        </div>
    );
};

export default DashUserCard;