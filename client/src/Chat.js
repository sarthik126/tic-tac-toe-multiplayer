import React from 'react'
import './Chat.css';

export default function Chat({sendMessage, messages, currentMessage, setCurrentMessage}) {
  return (
  <>
    <div>Chat</div>
    <form onSubmit={sendMessage}>
        <input type="text" onChange={(e)=> setCurrentMessage(e.target.value)} value={currentMessage} />
        <button type='submit'>Send</button>
    </form>

    <div className='messages'>
        {messages.map((item, index)=> <div className='message' key={index}>{item.message}</div>)}
    </div>
    </>
  )
}
