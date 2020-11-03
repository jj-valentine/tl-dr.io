import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
// Component(s)
import StateContext from "../StateContext.jsx";
import NavLoggedOut from "./NavLoggedOut.jsx";
import NavLoggedIn from "./NavLoggedIn.jsx";

function NavBar() {
  const state = useContext(StateContext);

  return (
    <header className="bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-3">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" 
            data-tip={state.loggedIn ? "Feed" : "Home"}
            data-for="home" 
            className="text-white">
            blogurt
          </Link>
          <ReactTooltip id="home" border={true} className="custom-tooltip" />
        </h4>
        {state.loggedIn ? <NavLoggedIn  /> : <NavLoggedOut />}
      </div>
    </header>
  );
}

export default NavBar;
