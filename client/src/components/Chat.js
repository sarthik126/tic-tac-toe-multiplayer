import React from "react";
import "./GameBoard";

export default function Chat({
  sendMessage,
  messages,
  currentMessage,
  setCurrentMessage,
  userName
}) {
  return (
    <>
      <div className="chat">
        {messages.map((item, index) =>
          item.playerName === userName ? (
            <div key={index} className="chat-me">
              {item.message}
            </div>
          ) : (
            <div key={index} className="chat-other">
              {item.message}
            </div>
          )
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
