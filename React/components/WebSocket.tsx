
import React, { useEffect, useRef, createContext } from 'react';
import {WebSocketClient, OpCodeHandler} from "../util/ws";

interface WebSocketProps {
    listeners: Map<number, OpCodeHandler[]>;
    children?: React.ReactNode;
}

// create context to store listeners so we can add them from the children
export const WebSocketContext = createContext<WebSocketClient | null>(null);


const WebSocketComponent: React.FC<WebSocketProps> = ({ listeners, children }) => {
    const wsRef = useRef<WebSocketClient | null>(null);


    useEffect(() => {
        if (wsRef.current) return;
        
        wsRef.current = new WebSocketClient();

        for (const [opCode, handlers] of listeners.entries()) {
            handlers.forEach(handler => {
                wsRef.current?.addListener(opCode, handler);
                console.log(`Added listener for opCode ${opCode}`);
            });
        }

        return () => {

        };
    }, [listeners]);

    return<>
        <WebSocketContext.Provider value={wsRef.current}>
            {children}
        </WebSocketContext.Provider>
    </>;
};

export default WebSocketComponent;
