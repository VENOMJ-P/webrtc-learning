import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SocketContext } from '../Context/SocketContext';

const Room:React.FC = () => {
    const {id}=useParams();
    const socket = useContext(SocketContext)
    
    useEffect(() => {
        if (socket && id) {
            socket.emit("joined-room", { roomId: id });
            console.log("Joined room:", id);
        }
    }, [id, socket]);
    console.log(socket)
    return (

        <div>Room: {id}</div>
    )
}

export default Room