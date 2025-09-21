import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs"
import {v4 as UUId} from "uuid"
import { peerReducer } from "../Reducers/peerReducer";
import { addPeerAction } from "../Actions/peerActions";

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
  const [stream,setStream] = useState<MediaStream>();
  const [peers,dispatch] = useReducer(peerReducer,{})

  const fetchParticipants = ({participants,roomId}:{participants:string[],roomId:string}) =>{
      console.log(roomId,participants)
  }

  const fetchUserFeed = async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
    setStream(stream)    
  }


  useEffect(() => {
    const userId = UUId()
    const newPeer = new Peer(userId,{
      host: "localhost",
      port:9000,
      path:"/"
    });

    setUser(newPeer)
    fetchUserFeed()

    const enterRoom = ({roomId}:{roomId: string}) => {
      console.log(roomId)
      navigate(`/room/${roomId}`);
    };

    // we will transer the user to the room when we collect an event of room created from server
    socket.on("room-created",enterRoom)

    socket.on('get-users',fetchParticipants)

    return () => {
      socket.off("room-created", enterRoom);
    };
  }, []);


  useEffect(()=>{
    if(!user || !stream ) return;

    // 2
    socket.on("user-joined",({peerId})=>{
      const call = user.call(peerId,stream) //Calls the remote peer specified by id and returns a media connection.
      console.log("Calling the new peer",peerId)
      call.on("stream",()=>{
        dispatch(addPeerAction(peerId,stream));
      })
    })

    // 3
    user.on("call",(call)=>{
      // what to do when other peers on the group call  you when y joined
      console.log("receving a call");
      call.answer(stream);
      call.on("stream",()=>{
        dispatch(addPeerAction(call.peer,stream));
      })        
    })

    // 1
    socket.emit("ready")
  },[user,stream])

  return (
    <SocketContext.Provider value={{socket, user, stream, peers}}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;