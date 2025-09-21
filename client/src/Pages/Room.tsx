import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SocketContext } from '../Context/SocketContext';
import UserFeedPlayer from '../Components/UserFeedPlayer';

const Room:React.FC = () => {
    const {id}=useParams();
    const {socket,user,stream,peers} = useContext(SocketContext)

    const fetchParticipants = ({participants,roomId}:{participants:string[],roomId:string}) =>{
        console.log(roomId,participants)
    }
    
    useEffect(() => {
        if (user && socket && id) {
            socket.emit("joined-room", {  peerId:user._id, roomId: id});
            console.log("Joined room:", id);

            socket.on('user-joined', fetchParticipants);

            return () => {
            socket.off('user-joined', fetchParticipants);
            };
        }
    }, [id,socket,user,peers]);
    return (

        <div>
            Room: {id}
            <UserFeedPlayer stream={stream}/>

            <div>
                Other Users fetchUserFeed
                {
                    Object.keys(peers).map((peerId)=>{
                        return <UserFeedPlayer key={peerId} stream={peers[peerId].stream}/>
                    })
                }
            </div>
        </div>
    )
}

export default Room