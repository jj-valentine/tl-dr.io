import React from "react";
import { Link } from "react-router-dom";

function LinkedPost({ post }) {
  const date = new Date(post.createdDate);
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  return (
    <Link to={`/post/${post["_id"]}`} className="list-group-item list-group-item-action">
      <img className="avatar-tiny" src={post.author.avatar} /> <strong>{post.title}</strong>
      <span className="text-muted small"> {post.edited ? "Edited" : "Posted"} on {formattedDate} </span>
    </Link>
  );
}

export default LinkedPost;