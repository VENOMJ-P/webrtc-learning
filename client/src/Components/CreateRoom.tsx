import React, { useContext } from 'react'
import { SocketContext } from '../Context/SocketContext';

const CreateRoom:React.FC = () => {
  const {socket} = useContext(SocketContext)

  const initRoom = ()=>{
    console.log(socket)
    socket.emit("create-room")
  }

  return (
    <button 
        className='btn btn-secondary'
        onClick={initRoom}
    >
        Start a new metting a new room
    </button>
  )
}

export default CreateRoom;