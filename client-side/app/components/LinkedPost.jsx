import React, { useContext } from "react";
import { Link } from "react-router-dom";
// Component(s)
import StateContext from "../StateContext.jsx";
import DispatchContext from "../DispatchContext.jsx";

function LinkedPost({ post, otherAuthor }) {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const date = new Date(post.createdDate);
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
 
  function handleCloseSearchOrNavigate() {
    if (state.search.isOpen) dispatch({ type: "toggleSearch" });
  }

  return (
    <Link onClick={handleCloseSearchOrNavigate} to={`/post/${post["_id"]}`} className="list-group-item list-group-item-action">
      <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>
      <span className="text-muted small"> 
        {post.edited ? " Edited " : " Posted "} 
        {
          otherAuthor && (
            <span>
              by <strong>{post.author.username}</strong> 
              {" "}
            </span>
          )
        }
        on {" "} 
        {formattedDate} 
      </span>
    </Link>
  );
}

export default LinkedPost;