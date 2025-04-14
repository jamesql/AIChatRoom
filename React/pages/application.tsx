import React, {useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import ApiClient from "@/util/api";
import NavigationBar from "@/components/NavigationBar";
import classes from "../styles/application.module.css";
import Footer from "@/components/Footer";
import WebSocketComponent from '@/components/WebSocket';
import { OpCodeHandler, WebSocketClient } from '@/util/ws';
import { OPCodes } from '../../TYPES/socketTypes';
import { Lobby, LobbyStatus, Prompt } from '../../TYPES/lobbyTypes';
import Dashboard from './dashboard';
import LobbyDev from './lobby_dev';
import PromptDev from './prompt_dev';

const Application: React.FC = () => {
    const [authed, setAuthed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string>("");

    // lobby detail stuff
    const [lobby, setLobby] = useState<Lobby | null>(null);
    const [localStatus, setLocalStatus] = useState<LobbyStatus | null>(null);
    const [curPrompt, setPrompt] = useState<Prompt | null>(null);

    const handleLogout = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
    }

    useEffect(() => {
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");
    
        if (!accessToken || !refreshToken) {
          // redirect to login page
          window.location.href = "/login";
        } else {
          setAuthed(true);
          setLoading(false);
        }
      }, []);

    const listeners = new Map<number, OpCodeHandler[]>();

    const handleHello: OpCodeHandler = async (data: any, client: WebSocketClient) => {
        console.log("Received data:", data);
        const token = Cookies.get("accessToken");

        client.send({
            op: OPCodes.AUTH,
            d: {
                access_token: token
            }
        })
    }

    const handleReady: OpCodeHandler = async (data: any, client: WebSocketClient) => {
        console.log("Received data:", data);

        setUserId(data.userId);
    }

    const handleJoinLobby: OpCodeHandler = async (data: any, client: WebSocketClient) => {
        console.log("Received data:", data);

        setLobby(data.lobby);
        setLocalStatus(data.lobby.status);


    }

    const handleUserJoined: OpCodeHandler = async (data: any, client: WebSocketClient) => {
        console.log("Received data:", data);
        const newLobby = data.lobby;
        setLobby(newLobby);
    }
    const handleUserLeft: OpCodeHandler = async (data: any, client: WebSocketClient) => {
        console.log("Received data:", data);
        const newLobby = data.lobby;
        setLobby(newLobby);
    }

    const handlePrompt: OpCodeHandler = async (data: any, client: WebSocketClient) => {
        console.log("Received data:", data);
        const newLobby = data.lobby;
        setLobby(newLobby);
        setLocalStatus("prompt");
        setPrompt(data.prompt);
    }




    listeners.set(OPCodes.HELLO, [handleHello]);
    listeners.set(OPCodes.READY, [handleReady]);
    listeners.set(OPCodes.JOIN_LOBBY, [handleJoinLobby]);
    listeners.set(OPCodes.LOBBY_USER_JOIN, [handleUserJoined]);
    listeners.set(OPCodes.LOBBY_USER_LEAVE, [handleUserLeft]);
    listeners.set(OPCodes.PROMPT, [handlePrompt]);


    

    if (loading) {
        return <div>Loading...</div>;
    } else return (
        <div>
            <WebSocketComponent url="ws://localhost:444" listeners={listeners}>


            {!lobby && (
                <Dashboard />
            )}

            {lobby && lobby.status==='lobby' && (
                <LobbyDev lobby={lobby} userId={userId} />
            )}

            {lobby && lobby.status==="prompt" && localStatus === "prompt" && curPrompt && (
                <PromptDev lobby={lobby} userId={userId} prompt={curPrompt} />
            )}

            </WebSocketComponent>

        </div>
    );
};

export default Application;