import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';
import { CSSTransition } from "react-transition-group";
// Component(s)
import StateContext from "./StateContext.jsx";
import DispatchContext from "./DispatchContext.jsx";
import NavBar from "./components/NavBar.jsx";
import Welcome from "./components/Welcome.jsx";
import HomeFeed from "./components/HomeFeed.jsx";
import Search from "./components/Search.jsx";
import Chat from "./components/Chat.jsx";
import CreatePost from  "./components/CreatePost.jsx";
import ViewPost from "./components/ViewPost.jsx";
import EditPost from "./components/EditPost.jsx";
import UserProfile from "./components/UserProfile.jsx";
import Footer from "./components/Footer.jsx";
import AboutUs from "./components/AboutUs.jsx";
import Terms from "./components/Terms.jsx";
import NotFound from "./components/NotFound.jsx";
import FlashMessage from "./components/FlashMessage.jsx";

// set base URL for API requests
Axios.defaults.baseURL = "http://localhost:8080";

function Main() {
  const initialState = {
    user: {
      token: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
      avatar: localStorage.getItem("avatar")
    },
    loggedIn: Boolean(localStorage.getItem("token")),
    flashMessages: [],
    search: {
      isOpen: false,
      input: "",
      results: []
    },
    chat: {
      isOpen: false,
      log: JSON.parse(localStorage.getItem("chatLog")) || [],
      unreadMessageCount: JSON.parse(localStorage.getItem("unreadMessageCount")) || 0
    }
  };

  function appReducer(draft, action) {
    const value = action.value;
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        if (value.token) draft.user.token = value.token;
        if (value.username) draft.user.username = value.username;
        if (value.avatar) draft.user.avatar = value.avatar;
        break;
      case "logout": 
        draft.loggedIn = false;
        draft.chat.isOpen = false;
        draft.chat.log = [];
        draft.chat.unreadMessageCount = 0;
        break;
      case "toggleSearch": 
        draft.search.isOpen = !draft.search.isOpen;
        break;
      case "toggleChat":
        draft.chat.isOpen = !draft.chat.isOpen;
        break;
      case "newChatMessage": 
        draft.chat.log.push({
          text: value.text,
          username: value.username,
          avatar: value.avatar
        });
        break;
      case "incrementMessageCount":
        draft.chat.unreadMessageCount++;
        break;
      case "clearMessageCount":
        draft.chat.unreadMessageCount = 0;
        break;
      case "updateSearchData":
        draft.search.input = value.input;
        draft.search.results = value.results;
        break;
      case "flashMessage":
        let message = value.message;
        // if there are several errors, only use the first for flash alert
        if (Array.isArray(message)) message = message[0];
        draft.flashMessages.push([message, value.alertType]);
        break;
    } 
  }
  
  const [state, dispatch] = useImmerReducer(appReducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("token", state.user.token);
      localStorage.setItem("username", state.user.username);
      localStorage.setItem("avatar", state.user.avatar);
      localStorage.setItem("unreadMessageCount", 0);
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("avatar");
      localStorage.removeItem("token");
      localStorage.removeItem("chatLog");
      localStorage.removeItem("unreadMessageCount");
    }
  }, [state.loggedIn])

  useEffect(() => {
    if (!state.search.isOpen && !state.search.results.length) { 
      dispatch({ 
        type: "updateSearchData", 
        value: { 
          input: "",
          results: []
        } 
      });
    }
  }, [state.search.isOpen]);

  useEffect(() => {
    if (state.chat.log.length) localStorage.setItem("chatLog", JSON.stringify(state.chat.log));
  }, [state.chat.log]);

  useEffect(() => {
    // why doesn't count persist after reload when you do JSON.parse(localStorage.getItem("unreadMessageCount")) ???
    if (state.loggedIn && localStorage.getItem("unreadMessageCount")) localStorage.setItem("unreadMessageCount", state.chat.unreadMessageCount);
  }, [state.chat.unreadMessageCount]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
        {/* why does this work now without conditional logic??? */}
        <FlashMessage messages={state.flashMessages} />
          <NavBar />
          <Switch>
            <Route exact path="/">
              {state.loggedIn ? <HomeFeed /> : <Welcome />}
            </Route>
            <Route path="/create-post">
              <CreatePost />
            </Route>
            <Route exact path="/post/:id">
              <ViewPost />
            </Route>
            <Route exact path="/post/:id/edit">
              <EditPost />
            </Route>
            <Route path="/profile/:username">
              <UserProfile />
            </Route>
            <Route path="/about-us">
              <AboutUs />
            </Route>
            <Route path="/terms">
              <Terms />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
          <Footer />
          <CSSTransition timeout={350} in={state.search.isOpen} classNames="search-overlay" unmountOnExit>
            <Search />
          </CSSTransition>
          <Chat />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) module.hot.accept();
