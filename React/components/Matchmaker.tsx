import React, {useState} from 'react';
import classes from "../styles/matchmaker.module.css";
import ApiClient from '@/util/api';
import Cookies from 'js-cookie';

const Matchmaker: React.FC = () => {
    const [publicLobby, setPublicLobby] = useState(true);
    const [privateLobby, setPrivateLobby] = useState(false);
    const [createLobby, setCreateLobby] = useState(false);




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
                    {publicLobby && (<button onClick={handleJoinPublicLobby}>
                        Join a Public Lobby
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