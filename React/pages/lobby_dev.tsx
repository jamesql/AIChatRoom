import React from 'react';
import classes from '../styles/lobby.module.css';
import NavigationBar from '@/components/NavigationBar';
import CurrentPlayers from '@/components/CurrentPlayers';
import LobbyHostOptions from '@/components/LobbyHostOptions';
import Footer from '@/components/Footer';

const LobbyDev: React.FC = () => {
    return (
        <div className={classes.container}>  
            <NavigationBar authButtons={false} />
            <CurrentPlayers players={[{ name: 'Player 1' }, { name: 'Player 2' }, { name: 'Player 3' }]} />
            <LobbyHostOptions />
            <Footer />
        </div>
    );
};

export default LobbyDev;