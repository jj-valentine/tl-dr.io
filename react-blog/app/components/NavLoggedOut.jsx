import React, { useContext, useState } from "react";
import Axios from 'axios';
// Component(s)
import DispatchContext from '../DispatchContext.jsx';

function NavLoggedOut() {
  const dispatch = useContext(DispatchContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [invalidField, setInvalidField] = useState(false);
  
  async function handleSignIn(e) {
    e.preventDefault()
    if (username.length === 0 || password.length === 0) {
      setInvalidField(true);
      dispatch({ 
        type: "flashMessage", 
        value: { message: "Please Enter Both Your Username and Password", alertType: "warning" }
      });
    } else {
      try {
        await Axios.post("/login", {
            username,
            password
          }).then(res => {
            if (res.data) {
              dispatch({ 
                type: "login", 
                value: { 
                  token: res.data.token,
                  username: res.data.username,
                  avatar: res.data.avatar
                } 
              });
              dispatch({ 
                type: "flashMessage", 
                value: { message: `Welcome Back "${res.data.username}"! Let's Get Back to Bloggin'!`, alertType: "success" }
              });
            } else {
              dispatch({ 
                type: "flashMessage", 
                value: { message: "Incorrect Username / Password", alertType: "danger" }
              });
            }
          });
      } catch (error) {
        console.log("Something Went Wrong!", error);
      }
    }
  }

  return (
    <form onSubmit={handleSignIn} className="mb-0 pt-2 pt-md-0 needs-validation">
      <div className="row align-items-center">
        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setUsername(e.target.value)} name="username" className={"form-control form-control-sm input-dark"} type="text" placeholder="Username" autoComplete="off" />
        </div>

        <div className="col-md mr-0 pr-md-0 mb-3 mb-md-0">
          <input onChange={e => setPassword(e.target.value)} name="password" className="form-control form-control-sm input-dark" type="password" placeholder="Password" />
        </div>
        
        <div className="col-md-auto">
          <button className="btn btn-success btn-sm">Sign In</button>
        </div>
      </div>
    </form>
  );
}

export default NavLoggedOut;
