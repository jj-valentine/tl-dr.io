import React, { useContext }  from "react";
import { Link, useHistory } from "react-router-dom";
import ReactTooltip from "react-tooltip";
// Component(s)
import StateContext from "../StateContext.jsx";
import DispatchContext from "../DispatchContext.jsx"

function NavLoggedIn() {
  const history = useHistory();
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  function handleSignOut(e) {
    e.preventDefault();
    dispatch({ type: "logout" });
    dispatch({ 
      type: "flashMessage", 
      value: { message:"Logged Out. See You Again Soon!", alertType: "light" }
    });
    history.push('/');
  }

  function handleToggleSearch(e) {
    e.preventDefault();
    dispatch({ type: "toggleSearch" });
  }
  
  return (
    <div className="flex-row my-3 my-md-0">
      <span onClick={handleToggleSearch} data-tip="Search" data-for="search" className="text-white mr-2 header-search-icon">
        <i className="fas fa-search"></i>
      </span>{" "}
      <ReactTooltip id="search" border={true} className="custom-tooltip" />


      <span data-tip="Chat" data-for="chat" className="mr-2 header-chat-icon text-white">
        <i className="fas fa-comment"></i>
        <span className="chat-count-badge text-white"> </span>
      </span>
      <ReactTooltip id="chat" border={true} className="custom-tooltip" />


      <Link to={`/profile/${state.user.username}`} data-tip="Profile" data-for="profile" className="mr-2">
        <span className="nav-username">{state.user.username}</span>
        <img className="small-header-avatar" src={state.user.avatar} />
      </Link>
      <ReactTooltip id="profile" border={true} className="custom-tooltip" />

      <Link to="/create-post" className="btn btn-sm btn-success mr-2">
        Create Post
      </Link>
      
      <button onClick={handleSignOut} className="btn btn-sm btn-secondary">
        Sign Out
      </button>
    </div>
  );
}

export default NavLoggedIn;
