import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SocketContext } from '../Context/SocketContext';

const Room:React.FC = () => {
    const {id}=useParams();
    const {socket,user} = useContext(SocketContext)

    const fetchParticipants = ({roomId,participants}:{roomId:string,participants:string[]}) =>{
        console.log(roomId,participants)
    }

    
    useEffect(() => {
        console.log(user)
        if (user && socket && id) {
            console.log("joining",user._id)
            socket.emit("joined-room", { roomId: id, peerId:user._id});
            console.log("Joined room:", id);
            
            socket.on('get-users',fetchParticipants)
        }
    }, [id,socket,user]);
    return (

        <div>Room: {id}</div>
    )
}

export default Room