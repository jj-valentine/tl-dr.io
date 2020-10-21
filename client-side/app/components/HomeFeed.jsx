import React, { useContext, useState, useEffect } from "react";
import Axios from "axios";
// Component(s)
import StateContext from '../StateContext.jsx'
import Page from "./Page.jsx"
import AnimatedLoadingIcon from "./AnimatedLoadingIcon.jsx";
import LinkedPost from "./LinkedPost.jsx";

function HomeFeed() {
  const state = useContext(StateContext);
  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState([]);
  
  useEffect(() => {
    const req = Axios.CancelToken.source();
    async function fetchHomeFeed() {
      try {
        await Axios.post('/getHomeFeed', {
          token: state.user.token
        }, {
          cancelToken: req.token
        }).then(res =>{
          setFeed(res.data);          
          setIsLoading(false);
        })
      } catch (error) {
        console.log("Issue Fetching Home Feed (Or Request Was Cancelled)!", error);
      }
    }
    fetchHomeFeed();
    return () => {
      req.cancel();
    }
  }, []);
  
  if (isLoading) {
    return (
      <Page title="...">
        <AnimatedLoadingIcon />
      </Page>
    );
  }
  
  return (
    <Page title={"Feed"}>
      { 
        feed.length === 0 && (
        <>
          <h2 className="text-center">
            Hello <strong>{state.user.username}</strong>, your feed is empty.
          </h2>
          <p className="lead text-muted text-center">Your feed displays the latest posts from the people you follow. If you don&rsquo;t have any friends to follow that&rsquo;s okay; you can use the &ldquo;Search&rdquo; feature in the top menu bar to find content written by people with similar interests and then follow them.</p>
        </>
      )}
      <div className="list-group"></div>
      { 
        feed.length > 0 && (
          <div className="text-center mb-4">
            <h3><strong>Recent Posts</strong> (From Those You Follow)</h3>
          </div>
        )
      }
      {feed.map(post => <LinkedPost post={post} key={post["_id"]} /> )}
    </Page>
  );
}

export default HomeFeed;
