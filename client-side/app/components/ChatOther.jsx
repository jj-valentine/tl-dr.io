import React from "react";
import { Link } from "react-router-dom";

function ChatOther({ message }) {
  return (
      <div className="chat-other">
        <Link to={`/profile/${message.username}`}>
          <img className="avatar-tiny" src={message.avatar} />
        </Link>
        <div className="chat-message">
          <div className="chat-message-inner">
            <Link to={`/profile/${message.username}`}>
              <strong>{message.username}: </strong>
            </Link>
            {message.text}
          </div>
        </div>
      </div>
  );
}

export default ChatOther;