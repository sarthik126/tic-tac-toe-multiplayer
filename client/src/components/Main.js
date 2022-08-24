import { useEffect, useState } from 'react';
import '../css/Main.css';
import GameBoard from './GameBoard'

const HOSTNAME = "http://localhost:5500"
const ROOM = "happy"

function Main() {

    const [userName,setUserName] = useState("")
    const [roomName,setRoomName] = useState("")
    const [roomValidation,setRoomValidation] = useState(false)

    function submitForm(e){
        e.preventDefault()
        setRoomValidation(true)
    }

  return (
    <> {!roomValidation ? 
        <div className='main'>
            <form onSubmit={submitForm}>
            <div>Enter Username</div>
            <input value={userName} onChange={(e)=>setUserName(e.target.value)} />
            <div>Enter Room</div>
            <input value={roomName} onChange={(e)=>setRoomName(e.target.value)} />
            <button type='submit'>Submit</button>
            </form>
        </div> :
        <GameBoard ROOM={roomName} userName={userName} setRoomValidation={setRoomValidation} />
        }
    </>
  );
}

export default Main;
