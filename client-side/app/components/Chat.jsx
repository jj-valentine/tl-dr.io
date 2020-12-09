import React, { useContext, useState, useEffect, useRef } from "react";
import io from "socket.io-client";
// Component(s)
import StateContext from "../StateContext.jsx";
import DispatchContext from "../DispatchContext.jsx";
import ChatSelf from "./ChatSelf.jsx";  
import ChatOther from "./ChatOther.jsx";

const socket = io("http://localhost:8080");

function Chat() {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const chatInputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [chatInput, setChatInput] = useState("");
  const [unreadMessages, setUnreadMessages] = useState(false);

  useEffect(() => {
    if (state.chat.isOpen) {
      chatInputRef.current.focus();
      setUnreadMessages(false);
      dispatch({ type: "clearMessageCount" });
    } else {
      setChatInput("");
    }
  }, [state.chat.isOpen]);

  useEffect(() => {
    socket.on("chatFromServer", message => {
      if (!state.chat.isOpen) setUnreadMessages(true);
      dispatch({ 
        type: "newChatMessage", 
        value: { 
          text: message.text,
          username: message.username,
          avatar: message.avatar
        }  
      });
    });
  }, []);
  
  // if chat is open, scroll as messages are sent
  useEffect(() => {
    const chatBox = chatBoxRef.current;
    if (state.chat.isOpen) chatBox.scroll({ top: chatBox.scrollHeight });
    if (!state.chat.isOpen && unreadMessages) {
      // ensure the log hasn't been cleared
      if (state.chat.log.length) {
        // ensure that the message does not belong to current user (sent from a different browser, for example)
        if (state.chat.log[state.chat.log.length - 1].username !== state.user.username) {
          dispatch({ type: "incrementMessageCount" });
        }
      }
    }
  }, [state.chat.log.length]);

  // if chat was previously closed, as you open it, smooth scroll to last sent message
  useEffect(() => {
    const chatBox = chatBoxRef.current;
    chatBox.scroll({ 
      top: chatBox.scrollHeight,
      behavior: 'smooth'
    });
  }, [state.chat.isOpen]);

  function handleTyping(e) {
    e.preventDefault();
    setChatInput(e.target.value);
  }

  function handleSubmitMessage(e) {
    e.preventDefault();
    if (chatInput.trim()) {
      socket.emit("chatFromClient", {
        text: chatInput,
        token: state.user.token
      });
      dispatch({ 
        type: "newChatMessage", 
        value: { 
          text: chatInput,
          username: state.user.username,
          avatar: state.user.avatar
        }  
      });
      setChatInput("");
    }
  }

  function handleCloseChat(e) {
    e.preventDefault();
    setChatInput("");
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
    <div id="chat" className="chat-log" ref={chatBoxRef}>
      {
        state.chat.log.map((message, i) => message.username === state.user.username ?
          <ChatSelf key={i} messageText={message.text} /> :
          <ChatOther key={i} message={message} />
        )
      }
    </div>
    <form onSubmit={handleSubmitMessage} id="chatForm" className="chat-form border-top">
      <input onChange={handleTyping} value={chatInput} ref={chatInputRef} type="text" className="chat-field" id="chatField" placeholder="Type a message…" autoComplete="off" />
    </form>
  </div>
  );
}

export default Chat;