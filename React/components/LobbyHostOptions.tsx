import React from 'react';

const LobbyHostOptions: React.FC = ({ }) => {
    return (
        <div className="lobby-host-options">
            <button  className="start-game-button">
                Start Game
            </button>
            <button className="end-lobby-button">
                End Lobby
            </button>
        </div>
    );
};

export default LobbyHostOptions;