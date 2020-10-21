import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
// Component(s)
import StateContext from "../StateContext.jsx";
import AnimatedLoadingIcon from "./AnimatedLoadingIcon.jsx";

function ProfileFollowing() {
  const { username } = useParams();
  const state = useContext(StateContext);
  const [following, setFollowing] = useState([]);  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const req = Axios.CancelToken.source();
    async function fetchUserFollowers() {
      try {
        await Axios.get(`/profile/${username}/following`, {
          cancelToken: req.token
        }).then(res => {
          setFollowing(res.data);
          setIsLoading(false);
        });
      } catch (error) {
        console.log("Issue Fetching List of Users You're Following (Or Request Was Cancelled)!", error);
      }
    }
    fetchUserFollowers();
    return () => {
      req.cancel();
    }
  }, [username]);

  if (isLoading) return <AnimatedLoadingIcon />

  return (
    <div className="list-group">
      {
        following.length > 0 && (
          following.map((user, i) => {
            return (
              <Link to={`/profile/${user.username}`} key={i} className="list-group-item list-group-item-action">
                <img className="avatar-tiny" src={user.avatar} /> {user.username}
              </Link>
            ); 
          })
        )
      }
      {
        state.loggedIn && username === state.user.username && following.length === 0 && (
          <p className="lead text-muted text-center">
            You Are Not Currently Following Anybody!
          </p>
        ) 
      }
    </div>
  );
}

export default ProfileFollowing;