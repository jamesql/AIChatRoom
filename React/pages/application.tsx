import React, {useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import ApiClient from "@/util/api";
import NavigationBar from "@/components/NavigationBar";
import classes from "../styles/application.module.css";
import Footer from "@/components/Footer";
import WebSocketComponent from '@/components/WebSocket';
import { OpCodeHandler, WebSocketClient } from '@/util/ws';
import { OPCodes } from '../../TYPES/socketTypes';
import { Answer, Lobby, LobbyStatus, Prompt } from '../../TYPES/lobbyTypes';
import Dashboard from './dashboard';
import LobbyDev from './lobby_dev';
import PromptDev from './prompt_dev';
import WaitingElement from './waiting';
import VotingDev from './voting_dev';
import LoseComponent from './lose';
import WinComponent from './win';
import VotedOut from './votedOut';
import '../envConfig.ts';


const Application: React.FC = () => {
    const [authed, setAuthed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string>("");
    const [wsUrl, setWsUrl] = useState<string>(`wss://${process.env.REACT_WS_URL}:444`);

    // lobby detail stuff
    const [lobby, setLobby] = useState<Lobby | null>(null);
    const [localStatus, setLocalStatus] = useState<LobbyStatus | null>(null);
    const [curPrompt, setPrompt] = useState<Prompt | null>(null);
    const [curAnswers, setAnswers] = useState<Answer[] | null>(null);

    const handleLogout = () => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
    }

    useEffect(() => {
        const accessToken = Cookies.get("accessToken");
        const refreshToken = Cookies.get("refreshToken");

        setWsUrl(`wss://${process.env.REACT_WS_URL}:444`);
    
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

    const handleAnswerSubmitted: OpCodeHandler = async (data: any, client: WebSocketClient) => {
        console.log("Received data:", data);
        const newLobby = data.lobby;
        setLobby(newLobby);

        setLocalStatus("waiting_answers");
    }

    const handleAllAnswersSubmitted: OpCodeHandler = async (data: any, client: WebSocketClient) => {
        console.log("Received data:", data);
        const newLobby = data.lobby;
        setLobby(newLobby);

        // make api request to start voting
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            console.error("Access token not found");
            return;
        }
        ApiClient.getInstance().startVoting(accessToken, newLobby.id).then((res) => {
            console.log("Started voting");
        }).catch((err) => {
            console.error(err);
        })
    };

    const handleBeginVoting: OpCodeHandler = async (data: any, client: WebSocketClient) => {
        console.log("Received data:", data);
        const newLobby = data.lobby;
        setLobby(newLobby);
        setLocalStatus("voting");

        setAnswers(data.answers);
    };

    const handleVoteSubmitted: OpCodeHandler = async (data: any, client: WebSocketClient) => {
        console.log("Received data:", data);
        const newLobby = data.lobby;
        setLobby(newLobby);
        setLocalStatus("waiting_voting");
    }

    const handleAllVotesSubmitted: OpCodeHandler = async (data: any, client: WebSocketClient) => {
        console.log("Received data:", data);
        const newLobby = data.lobby;
        setLobby(newLobby);

        // make api request to end voting
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            console.error("Access token not found");
            return;
        }

        ApiClient.getInstance().endVoting(accessToken, newLobby.id).then((res) => {
            console.log("Ended voting");
        }).catch((err) => {
            console.error(err);
        });
    }

    const handleVoteResults: OpCodeHandler = async (data: any, client: WebSocketClient) => {
        console.log("Received data:", data);
        const newLobby = data.lobby;
        setLobby(newLobby);
        setLocalStatus(newLobby.status);

        if (newLobby.status === "next_round") {
            // wait 10 seconds then start next round
            setTimeout(() => {
                const accessToken = Cookies.get("accessToken");
                if (!accessToken) {
                    console.error("Access token not found");
                    return;
                }

                // start next round
                ApiClient.getInstance().startNextRound(accessToken, newLobby.id).then((res) => {
                    console.log("Started next round");
                }).catch((err) => {
                    console.error(err);
                });


            }, 5000);
        }
    }

    const handleVotedOut: OpCodeHandler = async (data: any, client: WebSocketClient) => {
        console.log("Received data:", data);

        setLocalStatus("voted_out");
        
    };
        




    listeners.set(OPCodes.HELLO, [handleHello]);
    listeners.set(OPCodes.READY, [handleReady]);
    listeners.set(OPCodes.JOIN_LOBBY, [handleJoinLobby]);
    listeners.set(OPCodes.LOBBY_USER_JOIN, [handleUserJoined]);
    listeners.set(OPCodes.LOBBY_USER_LEAVE, [handleUserLeft]);
    listeners.set(OPCodes.PROMPT, [handlePrompt]);
    listeners.set(OPCodes.SUBMIT_PROMPT_RESPONSE, [handleAnswerSubmitted]);
    listeners.set(OPCodes.ALL_ANSWERS, [handleAllAnswersSubmitted]);
    listeners.set(OPCodes.BEGIN_VOTING, [handleBeginVoting]);
    listeners.set(OPCodes.SUBMIT_VOTE_RESPONSE, [handleVoteSubmitted]);
    listeners.set(OPCodes.ALL_VOTES, [handleAllVotesSubmitted]);
    listeners.set(OPCodes.VOTE_RESULT, [handleVoteResults]);
    listeners.set(OPCodes.VOTED_OUT, [handleVotedOut]);



    if (loading) {
        return <div>Loading...</div>;
    } else return (
        <div>
            <WebSocketComponent url={wsUrl} listeners={listeners}>


            {!lobby && (
                <Dashboard />
            )}

            {lobby && lobby.status==='lobby' && (
                <LobbyDev lobby={lobby} userId={userId} />
            )}

            {lobby && lobby.status==="prompt" && localStatus === "prompt" && curPrompt && (
                <PromptDev lobby={lobby} userId={userId} prompt={curPrompt} />
            )}

            {lobby && lobby.status==="prompt" && localStatus === "waiting_answers" && (
                <WaitingElement header="Waiting for answers" />
            )}

            {lobby && lobby.status==="voting" && localStatus==="voting" && curAnswers && (
                <VotingDev answers={curAnswers} userId={userId}/>
            )}

            {lobby && lobby.status==="voting" && localStatus === "waiting_voting" && (
                <WaitingElement header="Waiting for votes" />
            )}

            {lobby && lobby.status==="next_round" && (
                <WaitingElement header="The imposter still remains..." />
            )}

            {lobby && lobby.status==="ai_win" && (
                <LoseComponent />
            )}

            {lobby && lobby.status==="user_win" && (
                <WinComponent />
            )}

            {lobby && localStatus === "voted_out" && (
                <VotedOut />
            )}



            </WebSocketComponent>

        </div>
    );
};

export default Application;