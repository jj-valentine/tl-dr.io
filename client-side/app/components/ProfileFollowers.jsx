import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
// Component(s)
import StateContext from "../StateContext.jsx";
import AnimatedLoadingIcon from "./AnimatedLoadingIcon.jsx";

function ProfileFollowers({ newFollow }) {
  const { username } = useParams();
  const state = useContext(StateContext);
  const [isLoading, setIsLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  
  useEffect(() => {
    const req = Axios.CancelToken.source();
    async function fetchUserFollowers() {
      try {
        await Axios.get(`/profile/${username}/followers`, {
          cancelToken: req.token
        }).then(res => {
          setFollowers(res.data);
          setIsLoading(false);
        });
      } catch (error) {
        console.log("Issue Fetching User Followers (Or Request Was Cancelled)!", error);
      }
    }
    fetchUserFollowers();
    return () => {
      req.cancel();
    }
  }, [newFollow]);

  if (isLoading) return <AnimatedLoadingIcon />

  return (
    <div className="list-group">
      {
        followers.length > 0 && (
          followers.map((follower, i) => {
            return (
              <Link to={`/profile/${follower.username}`} key={i} className="list-group-item list-group-item-action">
                <img className="avatar-tiny" src={follower.avatar} /> {follower.username}
              </Link>
            ); 
          })
        )
      }
      {
        state.loggedIn && username === state.user.username && followers.length === 0 && (
          <p className="lead text-muted text-center">
            You don't have any followers yet!
          </p>
        ) 
      }
      {
        username !== state.user.username && followers.length === 0 && (
          <div className="lead text-muted text-center">
            <strong>{username}</strong> doesn't have any followers yet. 
            { 
              state.loggedIn && (
                <p>
                  {"\n"}
                  Be the first to follow them!
                </p> 
              )
            }
            { 
              !state.loggedIn && (
                <p>
                  {"\n"}
                  If you want to follow this user, you must first <Link to="/">sign up</Link> to create an account.
                </p>
              )
            }
          </div>
        )
      }
    </div>
  );
}

export default ProfileFollowers;