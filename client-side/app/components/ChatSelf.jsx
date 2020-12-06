import React, { useContext } from "react";
// Component(s)
import StateContext from "../StateContext.jsx";

function ChatSelf({ messageText }) {
  const state = useContext(StateContext);

  return (
    <div className="chat-self">
      <div className="chat-message">
        <div className="chat-message-inner">{messageText}</div>
      </div>
      <img className="chat-avatar avatar-tiny" src={state.user.avatar} />
    </div>
  );
}

export default ChatSelf;