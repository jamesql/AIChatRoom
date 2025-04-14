/// <reference path="../@types/global.d.ts" />

import { IncomingMessage } from "http";
import * as ws from "ws";
import { OPCodes } from "../../Types/socketTypes";
import TokenUtil from "../../Util/Token";
import { RedisPubSub } from "../../Util/Redis";
import { subscribe } from "diagnostics_channel";

// Import the TokenUtil class
const tokenUtil = new TokenUtil();

// Client message handler
export default async (
    ws: Socket.SocketServer,
    client: Socket.SocketClient,
    req: IncomingMessage,
    payload: ws.RawData
  ) => {
    let data;
  
    // make sure payload is valid
    try {
      data = JSON.parse(payload.toString());
    } catch (e) {
      data = null;
      console.log(e);
      console.log(payload);
    }
  
    // invalid packet, close connection
    if (data === null) return client.close();
  
    console.log(
      `[$wss] [Client>>Server] Recieved OP Code >${data.op}< from ${client.address}`
    );

};