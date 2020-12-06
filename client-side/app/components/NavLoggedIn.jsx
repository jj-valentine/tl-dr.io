import React, { useContext, useState, useEffect }  from "react";
import { Link, useHistory } from "react-router-dom";
import ReactTooltip from "react-tooltip";
// Component(s)
import StateContext from "../StateContext.jsx";
import DispatchContext from "../DispatchContext.jsx"

function NavLoggedIn() {
  const history = useHistory();
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [searchIconColor, setSearchIconColor] = useState("");

  useEffect(() => {
    if (state.search.results.length > 0) setSearchIconColor("red");
  }, [state.search.results]);

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
      
      <span onClick={handleToggleSearch} data-tip={"Search" + (state.search.results.length ? ` (${state.search.results.length} results)` : "")} data-for="search" className="text-white mr-2 header-search-icon" style={{ border: state.search.results.length > 0 ? "solid 1.5px #1de9b6" : "", padding: "4px"}}>
        <i className={"fas fa-search nav-icon" + (state.search.results.length ? " search-icon-results" : "" )}></i>
      </span>{" "}
      <ReactTooltip id="search" border={true} className="custom-tooltip" />


      <span data-tip="Chat" data-for="chat" className="mr-2 header-chat-icon text-white" style={{ paddingRight: "8px"}}>
        <i className="fas fa-comment nav-icon"></i>
        <span className="chat-count-badge text-white"></span>
      </span>
      <ReactTooltip id="chat" border={true} className="custom-tooltip" />

      <Link to="/create-post" className="btn btn-sm mr-2 create-post">
        Create Post
      </Link>
      
      <Link to={`/profile/${state.user.username}`} data-tip="Profile" data-for="profile" className="mr-2">
        <span className="nav-username">{state.user.username}</span>
        <img className="small-header-avatar" src={state.user.avatar} />
      </Link>
      <ReactTooltip id="profile" border={true} className="custom-tooltip" />

      
      
      <button onClick={handleSignOut} className="btn btn-sm sign-out">
        Sign Out
      </button>
    </div>
  );
}

export default NavLoggedIn;
