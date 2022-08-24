import React from "react";
import "./GameBoard";

export default function Chat({
  sendMessage,
  messages,
  currentMessage,
  setCurrentMessage,
  userName,
  messageRef
}) {
  return (
    <>
      <div className="chat">
        {messages.map((item, index) => {
          let lastMessage = index === messages.length - 1
          if(item.playerName === userName) {
            return (
            <div ref={lastMessage ? messageRef : null} key={index} className="chat-me">
              {item.message}
            </div> )
          } else {
            return (
            <div ref={lastMessage ? messageRef : null} key={index} className="chat-other">
              {item.message}
            </div>)
          }
        }
        )}
      </div>
      <form onSubmit={sendMessage}>
        <input
          className="message-input"
          type="text"
          onChange={(e) => setCurrentMessage(e.target.value)}
          value={currentMessage}
          required
          placeholder="Enter message..."
        />
        <button type="submit" className="btn btn-primary send-btn">
          Send
        </button>
      </form>
    </>
  );
}
