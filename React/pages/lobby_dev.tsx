import React, { useContext } from 'react';
import classes from '../styles/lobby.module.css';
import NavigationBar from '@/components/NavigationBar';
import CurrentPlayers from '@/components/CurrentPlayers';
import LobbyHostOptions from '@/components/LobbyHostOptions';
import Footer from '@/components/Footer';
import { Lobby } from '../../TYPES/lobbyTypes';

export interface LobbyProps {
    lobby: Lobby;
    userId: string;
}


const LobbyDev: React.FC<LobbyProps> = ({lobby, userId}) => {
    return (
        <div className={classes.container}>  
            <NavigationBar authButtons={false} />
            {lobby && (<CurrentPlayers players={lobby.users} />)}
    
            {lobby && lobby.host.id === userId && (
                <LobbyHostOptions lobbyId={lobby.id} />
            )}


            <Footer />
        </div>
    );
};

export default LobbyDev;