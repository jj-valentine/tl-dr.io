import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';
// Component(s)
import StateContext from "./StateContext.jsx";
import DispatchContext from "./DispatchContext.jsx";
import NavBar from "./components/NavBar.jsx";
import Welcome from "./components/Welcome.jsx";
import HomeFeed from "./components/HomeFeed.jsx";
import CreatePost from  "./components/CreatePost.jsx";
import ViewPost from "./components/ViewPost.jsx";
import EditPostt from "./components/EditPostt.jsx";
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
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("avatar");
      localStorage.removeItem("token");
    }
  }, [state.loggedIn])

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
              <EditPostt />
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
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) module.hot.accept();
