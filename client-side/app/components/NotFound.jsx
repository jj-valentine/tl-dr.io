import React from "react";
import { Link } from "react-router-dom";    
// Component(s)
import Page from "./Page.jsx";

function NotFound() {
  return (
  <Page title="Not Found" wide={true}> 
    <div className="text-center">
    <h2>Whoops! The Page You're Looking For Does Not Exist</h2>
    <p className="lead text-muted">
      Circle Back To The <Link to="/">Homepage</Link> For A Fresh Start!
    </p>
    </div>
  </Page>
  );
}

export default NotFound;