/// <reference path="../@types/global.d.ts" />

import { IncomingMessage } from "http";
import * as ws from "ws";
import { OPCodes } from "../../TYPES/socketTypes";
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

  switch (data.op) {
    case OPCodes.AUTH:
      const { d } = data;
      const token = d.access_token;

      if (!token) {
        client.close(1008, "Unauthorized.");
        break;
      }

      let decode = await tokenUtil.validateAccessToken(token);
      if (decode === null) {
        client.close(1008, "Unauthorized.");
        break;
      }

      let isExpired = Date.now() / 1000 > decode["exp"];

      if (isExpired) {
        client.close(1008, "Unauthorized.");
        break;
      }

      console.log(`[$wss] User ${decode["userId"]} authenticated!`);

      // create client subscriber instance
      let _subscriber = new RedisPubSub();
      client.subscriber = _subscriber;

      // send ready
      let payload = {
        op: OPCodes.READY,
        d: {
          userId: decode["userId"],
        },
      };

      client.sendAsync(payload);
      client.authenticated = true;

      ws.clients.add(client);

      client.subscriber.sub(`user:${decode["userId"]}:events`);

      client.subscriber.onMessage(
        (subscribedChannel: string, message: string) => {
          let data = JSON.parse(message);

          let opcode = data["op"];
          let d = data["d"];

          let payload = {
            op: opcode,
            d: d,
          };

          client.sendAsync(payload);
        }
      );
      break;
  }
};
