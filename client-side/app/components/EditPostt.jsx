import React, { useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
// Component(s)
import StateContext from "../StateContext.jsx";
import DispatchContext from "../DispatchContext.jsx";
import Page from "./Page.jsx";
import AnimatedLoadingIcon from "./AnimatedLoadingIcon.jsx";

function EditPostt() {
  const { id } = useParams();
  const history = useHistory();
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  
  const initialState = {
    title: {
      value: "",
      hasErrors: false,
      message: ""
    },
    body: {
      value: "",
      hasErrors: false,
      message: ""
    },
    fetchingPostData: true,
    updatesSaving: false,
    saveCount: 0
  }

  function editReducer(draft, action) {
    const value = action.value;
    switch(action.type) {
      case "fetchPostComplete":
        draft.title.value = value.title;
        draft.body.value = value.body;
        draft.fetchingPostData = false;
        break;
      case "editTitle":
        draft.title.value = value;
        break;
      case "editBody":
        draft.body.value = value;
        break;
      case "editPostRequest":
        draft.saveCount++;
        break;
      case "savingPost":
        draft.updatesSaving =  value;
        break;
    } 
  }

  const [postState, postDispatch] = useImmerReducer(editReducer, initialState);

  useEffect(() => {
    const req = Axios.CancelToken.source();
    async function fetchPost() {
      try {
        await Axios.get(`/post/${id}`, {
          cancelToken: req.token
        }).then(res => { 
          if (res.data) postDispatch({ type: "fetchPostComplete", value: res.data });
        });
      } catch (error) {
        console.log("Error Fetching Post (Or Request Was Cancelled)!", error);
      }
    }
    fetchPost();
    return () => {
      req.cancel();
    }
  }, []);

  useEffect(() => {
    if (postState.saveCount) {
      postDispatch({ type: "savingPost", value: true });
      async function saveUpdatedPost() {
        try {
          await Axios.post(`/post/${id}/edit`, {
            title: postState.title.value,
            body: postState.body.value,
            token: state.user.token
          }).then(res => {
            if (res.data = "success") {
              postDispatch({ type: "savingPost", value: false });
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
      saveUpdatedPost();
    }
  }, [postState.saveCount]);

  function handleEditPost(e) {
    e.preventDefault();
    postDispatch({ type: "editPostRequest" });
  }

  if (postState.fetchingPostData) {
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
          <input autoFocus 
            value={postState.title.value} 
            onChange={e => postDispatch({ type: "editTitle", value: e.target.value })} 
            name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea 
            value={postState.body.value} 
            onChange={e => postDispatch({ type: "editBody", value: e.target.value })} 
            name="body" id="post-body" className="body-content tall-textarea form-control" type="text" 
          />
        </div>
        {console.log(postState.updatesSaving)}
        <button disabled={postState.updatesSaving} className="btn btn-primary">Save Updated Post</button>
      </form>
    </Page>
  );
}

export default EditPostt;
