import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs"
import {v4 as UUId} from "uuid"

const WS_Server = "http://localhost:5500";


// eslint-disable-next-line @typescript-eslint/no-explicit-any, react-refresh/only-export-components
export const SocketContext = createContext< any | null>(null);
const socket = SocketIoClient(WS_Server); 

interface Props {
  children: React.ReactNode;
}

const SocketProvider: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate() // will help to programatically handle navigation

  // state variable to store the userId

  const [user,setUser] = useState<Peer>() //new peer user


  useEffect(() => {
    const userId = UUId()
    const newPeer = new Peer(userId);

    setUser(newPeer)
    const enterRoom = ({roomId}:{roomId: string}) => {
      console.log(roomId)
      navigate(`/room/${roomId}`);
    };

    // we will transer the user to the room when we collect an event of room created from server
    socket.on("room-created",enterRoom)

    return () => {
      socket.off("room-created", enterRoom);
    };
  }, []);

  return (
    <SocketContext.Provider value={{socket, user}}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;