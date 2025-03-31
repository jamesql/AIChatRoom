import React from 'react';
import classes from '../styles/lobby.module.css';
import NavigationBar from '@/components/NavigationBar';
import CurrentPlayers from '@/components/CurrentPlayers';

const LobbyDev: React.FC = () => {
    return (
        <div className={classes.container}>  
            <NavigationBar authButtons={false} />
            <CurrentPlayers players={[{ name: 'Player 1' }, { name: 'Player 2' }, { name: 'Player 3' }]} />
        </div>
    );
};

export default LobbyDev;