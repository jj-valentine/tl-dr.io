import React, { useContext, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Axios from "axios";
// Component(s)
import StateContext from "../StateContext.jsx";
import DispatchContext from "../DispatchContext.jsx";
import Page from "./Page.jsx";
import AnimatedLoadingIcon from "./AnimatedLoadingIcon.jsx";

function EditPost() {
  const { id } = useParams();
  const history = useHistory();
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  
  useEffect(() => {
    const req = Axios.CancelToken.source();
    async function fetchPost() {
      try {
        await Axios.get(`/post/${id}`, {
          cancelToken: req.token
        }).then(res => { 
          if (res.data) {
            setTitle(res.data.title) 
            setBody(res.data.body)
          }
        });
        setIsLoading(false);
      } catch (error) {
        console.log("Error Fetching Post (Or Request Was Cancelled)!", error);
      }
    }
    fetchPost();
    return () => {
      req.cancel();
    }
  }, []);

  async function handleEditPost(e) {
    e.preventDefault();
    try {
      await Axios.post(`/post/${id}/edit`, {
        title,
        body,
        token: state.user.token
      }).then(res => {
        if (res.data = "success") {
          dispatch({ 
            type: "flashMessage", 
            value: { message:"Post Successfully Edited!", alertType: "primary" }
          });
          history.push(`/post/${id}`);
        } else {
          dispatch({ 
            type: "flashMessage", 
            value: { message:"There Was An Issue Editing Your Post!", alertType: "danger" }
          });
        }
      })
    } catch (error) {
      console.log("Issue Editing Post!", error);
    }
  }

  function handleFormChange(e) {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    if (name === "body") setBody(value);
  }

  if (isLoading) {
    return (
      <Page title="...">
        <AnimatedLoadingIcon />
      </Page>
    );
  }

  return (
    <Page title={"Edit Post"}>
      <form onSubmit={handleEditPost}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input autoFocus value={title} onChange={handleFormChange} name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea value={body} onChange={handleFormChange} name="body" id="post-body" className="body-content tall-textarea form-control" type="text" />
        </div>

        <button className="btn btn-primary">Save Updated Post</button>
      </form>
    </Page>
  );
}

export default EditPost;