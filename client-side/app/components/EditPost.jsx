import React, { useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { useImmerReducer } from "use-immer";
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
  
  const initialState = {
    title: {
      previousValue: null,
      value: "",
      hasErrors: false
    },
    body: {
      previousValue: null,
      value: "",
      hasErrors: false
    },
    fetchingPostData: true,
    canSaveUpdate: true,
    saveCount: 0
  }

  function editReducer(draft, action) {
    const value = action.value;
    switch(action.type) {
      case "fetchPostComplete":
        draft.title.previousValue = value.title;
        draft.body.previousValue = value.body;
        draft.title.value = value.title;
        draft.body.value = value.body;
        draft.fetchingPostData = false;
        break;
      case "editTitle":
        if (draft.title.previousValue !== value) draft.canSaveUpdate = false;
        else draft.canSaveUpdate = true;
        draft.title.value = value;
        if (draft.title.value.trim().length !== 0) draft.title.hasErrors = false;
        break;
      case "editBody":
        if (draft.body.previousValue !== value) draft.canSaveUpdate = false;
        else draft.canSaveUpdate = true;
        draft.body.value = value;
        if (draft.body.value.trim().length !== 0) draft.body.hasErrors = false;
        break;
      case "editPostRequest":
        draft.saveCount++;
        break;
      case "savingPost":
        draft.canSaveUpdate = value;
        break;
      case "titleValidation":
        if (value.trim().length === 0) draft.title.hasErrors = true;
        break;
      case "bodyValidation":
        if (value.trim().length === 0) draft.body.hasErrors = true;
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
    if (postState.title.hasErrors || postState.body.hasErrors) {
      dispatch({ 
        type: "flashMessage", 
        value: { message:"Must Fix All Errors Before Saving Updated Post!", alertType: "danger" }
      });
    } else {
      postDispatch({ type: "editPostRequest" });
    }
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
            onBlur={e => postDispatch({ type: "titleValidation", value: e.target.value })}
            onChange={e => postDispatch({ type: "editTitle", value: e.target.value })} 
            name="title" id="post-title" className="form-control form-control-lg form-control-title" type="text" placeholder="" autoComplete="off" 
          />
          {
            postState.title.hasErrors && (
              <div className="alert alert-danger small liveValidateMessage">
                Please Add a TITLE to Your Post!
              </div>
            )
          }
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea 
            value={postState.body.value} 
            onBlur={e => postDispatch({ type: "bodyValidation", value: e.target.value })}
            onChange={e => postDispatch({ type: "editBody", value: e.target.value })} 
            name="body" id="post-body" className="body-content tall-textarea form-control" type="text" 
          />
           {
            postState.body.hasErrors && (
              <div className="alert alert-danger small liveValidateMessage">
                Please Add a BODY to Your Post!
              </div>
            )
          }
        </div>
        
        <div data-tip="Must Alter Post Body OR Title!" data-for="saveUpdatedPost">
          <button disabled={postState.canSaveUpdate} className="btn btn-primary">
            Save Updated Post
          </button>
        </div>
        { 
          postState.canSaveUpdate && (
            <ReactTooltip id="saveUpdatedPost" className="custom-tooltip" />
          )
        }
      </form>
    </Page>
  );
}

export default EditPost;
