import React, { useContext, useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom"; 
import ReactTooltip from "react-tooltip";
import ReactMarkdown from "react-markdown";
import Axios from "axios";
// Component(s)
import StateContext from "../StateContext.jsx";
import DispatchContext from "../DispatchContext.jsx";
import Page from "./Page.jsx";
import AnimatedLoadingIcon from "./AnimatedLoadingIcon.jsx";
import NotFound from "./NotFound.jsx";

function ViewPost() {
  const history = useHistory();
  const { id } = useParams();
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState();
  const [post, setPost] = useState();

  useEffect(() => {
    const req = Axios.CancelToken.source();
    async function fetchPost() {
      try {
        await Axios.get(`/post/${id}`, { 
          cancelToken: req.token 
        }).then(res => { 
          if (res.data) {
            setPost(res.data); 
            // format date
            const date = new Date(res.data.createdDate);
            setFormattedDate(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`);
            setIsNotFound(false);
          } else {
            setIsNotFound(true);
          }
        });
        setIsLoading(false);
      } catch (error) {
        console.log("Issue Fetching Post (Or Request Was Canceled)!", error);
      }
    }
    fetchPost();
    return () => {
      req.cancel();
    }
  }, [id]);

  const isOwner = () => state.loggedIn && post.author.username === state.user.username;

  async function handleDeletePost(e) {
    e.preventDefault()
    const deleteConfirmation = window.confirm("Are You Sure You Want To Delete This Post?");
    if (deleteConfirmation) {
      try {
        const response = await Axios({
          url: `/post/${post["_id"]}`, data: { token: state.user.token }, method: "delete"
        });
        if (response.data === "Success") {
          dispatch({
            type: "flashMessage",
            value: { message: "Post Successfully Deleted", alertType:"primary" }
          });
          history.push(`/profile/${state.user.username}`);
        }
      } catch (error) {
        console.log("Error Deleting Post!", error);
      }
    } 
  }

  if (isNotFound) return <NotFound />
  
  // fetching our post is happening asychronously so render will happen first -- thus, we make sure we've received post data before rendering
  if (isLoading) {
    return (
      <Page title="...">
        <AnimatedLoadingIcon />
      </Page>
    );
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        {
          isOwner() && (
            <span className="pt-2">
              <Link to={`/post/${post["_id"]}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
                <i className="fas fa-edit"></i>
              </Link>
              <ReactTooltip id="edit" className="custom-tooltip" /> {" "}
              <a onClick={handleDeletePost} data-tip="Delete" data-for="delete" className="delete-post-button">
                <i className="fas fa-trash delete-post"></i>
              </a>
              <ReactTooltip id="delete" className="custom-tooltip" />
            </span>
          )
        }
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        {post.edited ? " Edited" : " Posted"} by {" "} 
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link> 
        {" "} on {formattedDate}
      </p>

      <div className="body-content">
        <ReactMarkdown 
          source={post.body} 
          allowedTypes={["paragraph", "strong", "emphasis", "text", "heading", "list", "listItem"]} 
        />
      </div>

    <Link to={isOwner() ? `/profile/${state.user.username}` : '/'} className="back-to-link small font-weight-bold">
        Back to {isOwner() ? 'Posts' : 'Feed'}
      </Link>
    </Page>
  );
}

export default ViewPost;