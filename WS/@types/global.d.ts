// Global tyoes
import { Server } from "http";

export {};

declare global {

    namespace Socket {
      type Server = import("ws").Server;
      type WebSocket = import("ws");
  
      interface SocketServer extends Server {
        clients: Set<SocketClient>;
      }
  
      interface SocketClient extends WebSocket {
        type: "client";
        authenticated: boolean;
        address: String;
        activeSubscriptions: Set<string>;
  
        props: {
          sequence: number;
          lastHeartbeat: number;
        };
  
        sendAsync(data: any): Promise<void>;
      }
    }
  }