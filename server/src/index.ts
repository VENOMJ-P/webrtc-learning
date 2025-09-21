import cors from "cors";
import express from "express";
import http from "http";
import {Server} from "socket.io";
import ServerConfig from "./config/serverConfig.js";

import roomHandler from "./handler/roomHandler.js";

const  app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        methods: ["GET", "POST"],
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("New User Connected");
    // pass the socket connection to the room handler for room creation and joining
    const handler = roomHandler(socket);
    socket.on("disconnect", () => {
        console.log("User Disconnected");
        if (socket.data.roomId && socket.data.peerId) {
            handler.disconnect({
                peerId: socket.data.peerId,
                roomId: socket.data.roomId,
            });
        }
    });
});

server.listen(ServerConfig.PORT, () => {
    console.log(`Server is up at port ${ServerConfig.PORT}`);
});

export default server;
