import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SocketContext } from '../Context/SocketContext';
import UserFeedPlayer from '../Components/UserFeedPlayer';

const Room:React.FC = () => {
    const {id}=useParams();
    const {socket,user,stream} = useContext(SocketContext)
    
    useEffect(() => {
        if (user && socket && id) {
            socket.emit("joined-room", {  peerId:user._id, roomId: id});
            console.log("Joined room:", id);
        }
    }, [id,socket,user]);
    return (

        <div>
            Room: {id}
            <UserFeedPlayer stream={stream}/>
        </div>
    )
}

export default Room