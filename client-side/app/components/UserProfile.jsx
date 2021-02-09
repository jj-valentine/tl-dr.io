import React, { useContext, useState, useEffect } from "react";
import { useParams, NavLink, Switch, Route } from "react-router-dom";
import { useImmer } from "use-immer";
import Axios from "axios";
// Component(s)
import StateContext from "../StateContext.jsx";
import DispatchContext from "../DispatchContext.jsx";
import Page from "./Page.jsx";
import AnimatedLoadingIcon from "./AnimatedLoadingIcon.jsx";
import NotFound from "./NotFound.jsx";
import UserPosts from "./UserPosts.jsx";
import ProfileFollowers from "./ProfileFollowers.jsx";
import ProfileFollowing from "./ProfileFollowing.jsx";

function UserProfile() {
  const { username } = useParams();
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [profileState, setProfileState] = useImmer({
    username: "...",
    avatar: "https://gravatar.com/avatar/placeholder?s=128",
    isFollowing: false,
    counts: { postCount: "", followerCount: "", followingCount: "" }
  });
  
  useEffect(() => {
    const req = Axios.CancelToken.source();
    async function fetchProfileData() {
      try {
        await Axios.post(`/profile/${username}`, {
          token: state.user.token
        }, {
          cancelToken: req.token
        }).then(res => {
          if (res.data) {
            setProfileState(draft => {
              draft.username = res.data.profileUsername;
              draft.avatar = res.data.profileAvatar;
              draft.isFollowing = res.data.isFollowing;
              draft.counts = res.data.counts;
            });
            setIsNotFound(false);
          } else setIsNotFound(true);          
          setIsLoading(false);
        });
      } catch (error) {
        console.log("Error Fetching Profile Data (Or Request Was Cancelled)!", error);
      }
    }
    fetchProfileData();
    return () => {
      req.cancel();
    }
  }, [username]);

  async function handleStartFollowing(e) {
    e.preventDefault();
    setFollowLoading(true);
    try {
      await Axios.post(`/addFollow/${profileState.username}`, {
        token: state.user.token
      }).then(res => {
        setProfileState(draft => {
          draft.isFollowing = true;
          draft.counts.followerCount++;
        })
        setFollowLoading(false);
        dispatch({
          type: "flashMessage",
          value: { message: `You're Now Following ${profileState.username}!`, alertType:"primary" }
        });      
      })
    } catch (error) {
      console.log("Issue Adding Follower!", error);
    }
  }
  
  async function handleStopFollowing(e) {
    e.preventDefault();
    setFollowLoading(true);
    try {
      await Axios.post(`/removeFollow/${profileState.username}`, {
        token: state.user.token
      }).then(res => {
        setProfileState(draft => {
          draft.isFollowing = false;
          draft.counts.followerCount--;
        })
        setFollowLoading(false);
        dispatch({
          type: "flashMessage",
          value: { message: `You're No Longer Following ${profileState.username}!`, alertType:"primary" }
        });      
      })
    } catch (error) {
      console.log("Issue Removing Follower!", error);
    }
  }

  if (isNotFound) return <NotFound />

  if (isLoading) {
    return (
      <Page title="...">
        <AnimatedLoadingIcon />
      </Page>
    );
  }
  
  return (
    <Page title="Profile">
      <h2>
        <img className="avatar-small" src={profileState.avatar} />
        {username}
        {
          state.loggedIn && state.user.username !== username  && !profileState.isFollowing && profileState.username !== "..." && (
            <button onClick={handleStartFollowing} disabled={followLoading} className="btn btn-primary btn-sm ml-2">
              Follow <i className="fas fa-user-plus"></i>
            </button>
          ) 
        } 
        {
          state.loggedIn && state.user.username !== username && profileState.isFollowing && profileState.username !== "..." && (
            <button onClick={handleStopFollowing} disabled={followLoading} className="btn btn-danger btn-sm ml-2">
              Unfollow <i className="fas fa-user-times"></i>
            </button>
          )
        }
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink to={`/profile/${username}`} className="nav-item nav-link text-info">
          Posts: {profileState.counts.postCount}
        </NavLink>
        <NavLink to={`/profile/${username}/followers`} className="nav-item nav-link text-info">
          Followers: {profileState.counts.followerCount}
        </NavLink>
        <NavLink to={`/profile/${username}/following`} className="nav-item nav-link text-info">
          Following: {profileState.counts.followingCount}
        </NavLink>
      </div>

      <Switch>
        <Route exact path="/profile/:username">
          <UserPosts />
        </Route>
        <Route path="/profile/:username/followers">
          <ProfileFollowers newFollow={followLoading} />
        </Route>
        <Route path="/profile/:username/following">
          <ProfileFollowing />
        </Route>
      </Switch>
    </Page>
  );
}

export default UserProfile;
