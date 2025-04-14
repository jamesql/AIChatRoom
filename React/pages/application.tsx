import React, {useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import ApiClient from "@/util/api";
import NavigationBar from "@/components/NavigationBar";
import classes from "../styles/application.module.css";
import Footer from "@/components/Footer";
import WebSocketComponent from '@/components/WebSocket';
import { OpCodeHandler, WebSocketClient } from '@/util/ws';
import { OPCodes } from '../../TYPES/socketTypes';
import { Lobby, LobbyStatus } from '../../TYPES/lobbyTypes';

const Application: React.FC = () => {
    const [authed, setAuthed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string>("");

    // lobby detail stuff
    const [lobby, setLobby] = useState<Lobby | null>(null);
    const [lobbyStatus, setLobbyStatus] = useState<LobbyStatus | null>(null);

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

    listeners.set(OPCodes.HELLO, [handleHello]);
    listeners.set(OPCodes.READY, [handleReady]);

    

    if (loading) {
        return <div>Loading...</div>;
    } else return (
        <div>
            <WebSocketComponent url="ws://localhost:444" listeners={listeners} />
            <NavigationBar authButtons={false} />
            <Footer />
        </div>
    );
};

export default Application;