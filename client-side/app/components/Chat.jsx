import React, { useContext, useState, useEffect } from "react";
// Component(s)
import StateContext from "../StateContext.jsx";
import DispatchContext from "../DispatchContext.jsx";
import ChatSelf from "./ChatSelf.jsx";  
import ChatOther from "./ChatOther.jsx";

function Chat() {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [chatInput, setChatInput] = useState("");

  function handleTyping(e) {
    e.preventDefault();
    setChatInput(e.target.value);
  }

  function handleSubmitMessage(e) {
    e.preventDefault();
    dispatch({ type: "newChatMessage", value: chatInput });
    setChatInput("");
  }

  function handleCloseChat(e) {
    e.preventDefault();
    dispatch({ type: "toggleChat" });
  }

  return (
    <div id="chat-wrapper" className={"chat-wrapper shadow border-top border-left border-right" + (state.chat.isOpen ? " chat-wrapper--is-visible" : "")}>
    <div className="chat-title-bar bg-primary">
      Chat
      <span onClick={handleCloseChat} className="chat-title-bar-close">
        <i className="fas fa-times-circle"></i>
      </span>
    </div>
    <div id="chat" className="chat-log">
      
      {
        state.chat.log.map((message, i) => message.username === state.user.username ? 
          <ChatSelf key={i} messageText={message.text} /> :
          <ChatOther key={i} message={message} />
        )
      }
      
    </div>
    <form onSubmit={handleSubmitMessage} id="chatForm" className="chat-form border-top">
      <input autoFocus onChange={handleTyping} value={chatInput} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
    </form>
  </div>
  );
}

export default Chat;