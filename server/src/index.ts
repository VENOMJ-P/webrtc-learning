import {Server} from "socket.io"

import cors from "cors"
import express from "express";
import http from "http";
import ServerConfig from "./config/serverConfig.js";

const  app = express();
app.use(cors())

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})

io.on("connection", (socket)=>{
    console.log("New User Connected");


    socket.on("disconnect",()=>{
        console.log("User Disconnected")
    })
})

server.listen(ServerConfig.PORT, () => {
    console.log(`Server is up at port ${ServerConfig.PORT}`);
});

export default server;
