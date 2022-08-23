import { useEffect, useState, useCallback, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { solutions } from './Solutions'
import { io } from 'socket.io-client'

const HOSTNAME = "http://localhost:5500"

function App({ROOM, userName}) {

  // const socket = io(HOSTNAME, {query:{ roomId:ROOM, playerName: userName }})
  const socket = useMemo(() => io(HOSTNAME, {query:{ roomId:ROOM, playerName: userName }}), [ROOM, userName]);

  const PLACE_HOLDER = ''
  const BOXES = 9

  const [board,setBoard] = useState(Array(BOXES).fill(PLACE_HOLDER))
  const [current, setCurrent] = useState(true)
  const [isFinished, setIsFinished] = useState(false)
  const [isWaiting,setIsWaiting] = useState(false)

  const [myRole, setMyRole] = useState("...")

  const [secondPlayer, setSecondPlayer] = useState("...")
  const [allPlayers,setAllPlayers] = useState({})

  const [winners,setWinners] = useState([])
  const [firstReq, setFirstReq] = useState(true)

  function setData(index) {

    let data = [...board]
    data[index] = current ? 'X' : 'O'

    setBoard([...data])
    setIsWaiting(prev => !prev)
    setCurrent(!current)

    socket.emit("board",{ board:{board:data,current:!current,isFinished:isFinished,playerName:userName},roomName:ROOM })

    if(firstReq) {
      socket.emit("set-role",{playerName:userName,socketId: socket.id,roomName:ROOM,role: current ? 'X' : 'O'})
      setFirstReq(false)
      setMyRole(current ? 'X' : 'O')
      console.log(current ? 'X' : 'O')
    }
  }

  function validateData() {
    solutions.forEach((item,index)=>{

    let tempList = [...board]
    let temp = [tempList[item[0]],tempList[item[1]],tempList[item[2]]]
    
      if(JSON.stringify(temp) === '["X","X","X"]' || JSON.stringify(temp) === '["O","O","O"]') {

        let currentPlayer = !current ? 'X' : 'O'
        
        fetch(`${HOSTNAME}/getPlayerRoles/${ROOM}`)
        .then((res)=>res.json())
        .then((data)=> {
          // console.log(data)
          let flag = currentPlayer == 'X'
          let winPlayer;

          if(flag) {
            if(data.player1.role === 'X'){
              winPlayer = data.player1.playerName
            } else {
              winPlayer = data.player2.playerName
            }
          } else {
            if(data.player1.role === 'O'){
              winPlayer = data.player1.playerName
            } else {
              winPlayer = data.player2.playerName
            }
          }

          toast(`${winPlayer} (${currentPlayer}) - won the game !!!`,{
            position: toast.POSITION.TOP_CENTER
          });

          setWinners([...winners,winPlayer])
          setFirstReq(true)

        }).catch((err)=>console.log(err))

        setIsFinished(true)

      }
    })
  }

  function resetBoard() {
    setBoard(Array(BOXES).fill(PLACE_HOLDER))
    setIsFinished(false)
    setCurrent(true)

    socket.emit("board",{ board:{board:Array(BOXES).fill(PLACE_HOLDER),current:true,isFinished:false,playerName:userName},roomName:ROOM })

    setIsWaiting(false)
    setMyRole("X")

    fetch(`${HOSTNAME}/setPlayerRoles/${ROOM}`)
    .then((res)=> {
      console.log(res)
    })
    .catch((err)=>console.log(err))

  }

  useEffect(() => {
    validateData()
  },[board])

  useEffect(() => {
    socket.on("board",(data) => {
      console.log("BOARD")
      setBoard(data.board)
      setCurrent(data.current)
      setIsWaiting(false)
      setIsFinished(data.isFinished)
    })

    // socket.on("all-users",(data) => {
    //   setAllPlayers(data)
    // })

    socket.on("new-user",(data)=>{
      resetBoard()
      console.log(data)
      setAllPlayers(data)
    })

    socket.on("remove-user",(data)=>{
      console.log(data)
      setSecondPlayer("...")

      toast(`${data} disconnected from the game !!!`,{
        position: toast.POSITION.TOP_CENTER
      });

      resetBoard()
    })

  },[socket])


  useEffect(() => {
      if(allPlayers?.player1?.playerName === userName){
        setSecondPlayer(allPlayers.player2.playerName ? allPlayers.player2.playerName : "...")
      } else if (allPlayers?.player2?.playerName === userName) {
        setSecondPlayer(allPlayers.player1.playerName ? allPlayers.player1.playerName : "...")
      } else {
        setSecondPlayer("...")
      }
  },[allPlayers])

  return (
    <>
    <ToastContainer className='toaster' />
    <div className='header'>
      <div className="logo">Tic-Tac-Toe</div>
      {/* <div className="logo">{myRole}</div> */}

      <div className='players'>
      <div className='player-1'>{userName}</div>
      <div className='gap'><i className="fa-solid fa-shield-alt"></i></div>
      <div className='player-2'>{secondPlayer}</div>
      </div>

      <div>
        {(isFinished || !board.includes("")) ? <button className='reset-btn' onClick={resetBoard}>Reset Board</button> : <div className='current-player'>Next Player : <span className='next-player'>{current ? 'X' : 'O'}</span></div>}
      </div>
      </div>
    <div className="container">
    
      <div className='board'>
        {board.map((val,index) => (
        <button disabled={(val !== PLACE_HOLDER || isFinished || isWaiting)} onClick={()=> setData(index)} key={index} className='box'>
          {val}
        </button>
        ))}
      </div>

    <div className='right-pane'>
      <div className='win-list'>Win List -</div>
      {winners.map((val,index) => (
        <button className='win-btn' key={index}>{`Match ${index+1} - ${val}`}</button>
        ))}
    </div>
    </div>
    </>
  );
}

export default App;
