import React, {useState} from 'react';
import classes from "../styles/matchmaker.module.css";

const Matchmaker: React.FC = () => {
    const [publicLobby, setPublicLobby] = useState(true);
    const [privateLobby, setPrivateLobby] = useState(false);
    const [createLobby, setCreateLobby] = useState(false);
    return (
        <div className={classes.container}>
            <div className={`${classes.section} ${classes.section_left}`}>
                <h1>Join a Lobby!</h1>
                <p>Find a public lobby or create one and play with friends!</p>
            </div>
            <div className={`${classes.section} ${classes.section_right}`}>
                <div className={classes.lobby_options}>
                    <button
                        className={`${classes.lobby_button} ${publicLobby ? classes.active : ''}`}
                        onClick={() => {
                            setPublicLobby(true);
                            setPrivateLobby(false);
                            setCreateLobby(false);
                        }}
                    >
                        Public Lobby
                    </button>
                    <button
                        className={`${classes.lobby_button} ${privateLobby ? classes.active : ''}`}
                        onClick={() => {
                            setPublicLobby(false);
                            setPrivateLobby(true);
                            setCreateLobby(false);
                        }}
                    >
                        Private Lobby
                    </button>
                    <button
                        className={`${classes.lobby_button} ${createLobby ? classes.active : ''}`}
                        onClick={() => {
                            setPublicLobby(false);
                            setPrivateLobby(false);
                            setCreateLobby(true);
                        }}
                    >
                        Create Lobby
                    </button>

                </div>
                <div className={classes.extras}>
                    {publicLobby && (<button>
                        <a href="/play">Join a Public Lobby</a>
                    </button>)}
                    {privateLobby && (<>
                    <label>
                        
                        <input type="text" placeholder="Enter Lobby ID" />
                    </label>
                    <button>
                        <a href="/play">Join a Private Lobby</a>
                    </button></>)}
                    {createLobby && (<button>
                        <a href="/play">Create a Lobby</a>
                    </button>)}
                </div>
            </div>
        </div>
    );
};

export default Matchmaker;