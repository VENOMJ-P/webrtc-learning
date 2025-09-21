import {Socket} from "socket.io";
import {v4 as UUIDv4 } from "uuid";
import IRoomParams from "../interfaces/IRoomParams";

const rooms: Record<string, string[]> = {};

const roomHandler = (socket: Socket) => {

    const createRoom = () => {
        // this will be our unique room id in which mulitple connection will exchange data
        const roomId = UUIDv4();
        // we will make the socket connection enter a new room
        socket.join(roomId);
        rooms[roomId] = [];
        // we will emit an event from server side that socket connection
        socket.emit("room-created", {roomId});
        console.log("room created with id ", roomId);
    };

    // The below function is executed everytime a user(creator or new user) joins in a new room

    const joinedRoom = ({roomId, peerId}: IRoomParams) => {
        if (rooms[roomId]) {
            // If the give roomId exist in the memory db
            console.log("New user has join room", roomId, " with peer id ", peerId);
            // the moment new user joins, add the peerId to the key of roomId
            rooms[roomId].push(peerId);
            socket.join(roomId);

            // Store for disconnect cleanup
            socket.data.roomId = roomId;
            socket.data.peerId = peerId;


            socket.emit("get-users", {
                participants: rooms[roomId],
                roomId,
            });
        }
    };

    const disconnect = ({ roomId, peerId }: IRoomParams) => {
        if (rooms[roomId]) {
            // Remove the peerId from the room's participant list
            rooms[roomId] = rooms[roomId].filter(id => id !== peerId);

            // If the room is now empty, optionally delete it
            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
                console.log(`Room ${roomId} deleted as it became empty`);
            } else {
                console.log(`Peer ${peerId} removed from room ${roomId}`);
            }

            // Broadcast updated participant list to remaining users
            socket.to(roomId).emit("get-users", {
                participants: rooms[roomId],
                roomId,
            });
        }
    };

    // we wil call the above two function when the client will emit events top create room and join room
    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);

    return {
        disconnect,
    };
};

export default roomHandler;
