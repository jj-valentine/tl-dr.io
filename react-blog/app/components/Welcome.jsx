import React, { useContext, useState } from "react";
import Axios from "axios";
// Component(s)
import DispatchContext from "../DispatchContext.jsx";
import Page from "./Page.jsx";

function Welcome() {
  const dispatch = useContext(DispatchContext);
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  async function handleSignUp(e) {
    e.preventDefault();
    try {
      await Axios.post("/register", {
        username,
        email,
        password
      }).then(res => {
        dispatch({ type: "login", value: { username, password } });
      });
      dispatch({
        type: "flashMessage",
        value: { message: "Howdy Ho Partner! Let's Do This!", alertType: "primary" }
      });
    } catch (error) {
      console.log("Something Went Wrong!", error);
      dispatch({
        type: "flashMessage",
        value: { message: "There Was An Issue With Your Registration!", alertType: "danger" }
      });
    }
  }

  function handleFormChange(e) {
    e.preventDefault();
    let input = e.target.name,
      data = e.target.value;
    if (input === "username") setUsername(data);
    if (input === "email") setEmail(data);
    if (input === "password") setPassword(data);
  }

  return (
    <Page title={"Welcome!"} wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">Are you sick of short tweets and impersonal &ldquo;shared&rdquo; posts that are reminiscent of the late 90&rsquo;s email forwards? We believe getting back to actually writing is the key to enjoying the internet again.</p>
        </div>

        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSignUp}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input onChange={handleFormChange} id="username-register" name="username" className="form-control" type="text" placeholder="Pick a username" autoComplete="off" />
            </div>

            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input onChange={handleFormChange} id="email-register" name="email" className="form-control" type="text" placeholder="you@example.com" autoComplete="off" />
            </div>

            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input onChange={handleFormChange} id="password-register" name="password" className="form-control" type="password" placeholder="Create a password" />
            </div>
            
            <button type="submit" className="py-3 mt-4 btn btn-lg btn-success btn-signup btn-block">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}

export default Welcome;
