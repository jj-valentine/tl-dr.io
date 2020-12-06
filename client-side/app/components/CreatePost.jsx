import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";
// Component(s)
import StateContext from "../StateContext.jsx";
import DispatchContext from "../DispatchContext.jsx";
import Page from "./Page.jsx";

function CreatePost() {  
  const history = useHistory();
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [title, setTitle] = useState();
  const [body, setBody] = useState();

  async function handleNewPost(e) {
    e.preventDefault();
    try {
      await Axios.post("/create-post", {
        title,
        body,
        token: state.user.token
      }).then(res => {
        if (!Array.isArray(res.data)) {
          dispatch({
            type: "flashMessage",
            value: { message: "New Post Created!", alertType:"primary" }
          });
          history.push(`/post/${res.data}`);
        } else {
          dispatch({
            type: "flashMessage",
            value: { message: res.data, alertType:"warning" }
          });
        }
      });
    } catch (error) {
      console.log("Issue Creating New Post!", error);
    }
  }

  function handleFormChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    if (name === "body") setBody(value);
  }

  return (
    <Page title={"Post"}>
      <form onSubmit={handleNewPost}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input autoFocus onChange={handleFormChange} name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea onChange={handleFormChange} name="body" id="post-body" className="body-content tall-textarea form-control" type="text"></textarea>
        </div>

        <button className="btn btn-primary post-button">Save New Post</button>
      </form>
    </Page>
  );
}

export default CreatePost;
