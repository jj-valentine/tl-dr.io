import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
// Component(s)
import StateContext from "../StateContext.jsx";
import AnimatedLoadingIcon from "./AnimatedLoadingIcon.jsx";
import LinkedPost from "./LinkedPost.jsx";

function UserPosts() {
  const { username } = useParams();
  const state = useContext(StateContext);
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
      {
        posts.length === 0 && (
          <div className="lead text-muted text-center">
            {
              state.loggedIn && username === state.user.username && (
                <>
                  You haven't made any posts yet.
                  <p>
                    <Link to="/create-post">
                      Create your first post!
                    </Link>
                  </p>
                </>
              )
            }
            {
              username !== state.user.username && (
                <p>
                  <strong>{username}</strong> hasn't made any posts yet!
                </p>
              )
            }
          </div>
        )
      } 
      {posts.map(post => <LinkedPost post={post} key={post["_id"]} feed={false} /> )}
    </div>
  );
}

export default UserPosts;