/// <reference path="./@types/global.d.ts" />

// include .env
require('dotenv').config();

// include util
require("./util");

import * as http from "http";
import * as ws from "ws";

const server = http.createServer();
const wss = new ws.Server({ server });

server.listen(80, process.env.SOCKET_IP_ADDRESS, () => {
    console.log(`[$wss] Server is listening on ${process.env.SOCKET_IP_ADDRESS}:80`);
});

wss.on("connection", require("./modules/connection").default.bind(null, wss));