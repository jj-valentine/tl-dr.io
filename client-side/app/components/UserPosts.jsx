import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
// Component(s)
import AnimatedLoadingIcon from "./AnimatedLoadingIcon.jsx";
import LinkedPost from "./LinkedPost.jsx";

function UserPosts() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const req = Axios.CancelToken.source();
    async function fetchUserPosts() {
      try {
        await Axios.get(`/profile/${username}/posts`, {
          cancelToken: req.token
        }).then(res => {
          setPosts(res.data);
          setIsLoading(false);
        });
      } catch (error) {
        console.log("Issue Fetching Posts (Or Request Was Cancelled)!", error);
      }
    }
    fetchUserPosts(); 
    return () => {
      req.cancel();
    }
  }, [username]);
  
  if (isLoading) return <AnimatedLoadingIcon />

  return (
    <div className="list-group">
      {posts.map(post => <LinkedPost post={post} key={post["_id"]} /> )}
    </div>
  );
}

export default UserPosts;