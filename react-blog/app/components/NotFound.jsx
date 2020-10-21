import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Page title="Not Found">
      <div className="text-center"> 
        Whoops! The Page You're Looking For Does Not Exist
      </div>  
      <p className="lead text-muted">
        Circle back to the <Link to="/">front page</Link> for a fresh start!
      </p>
    </Page>
  );
}

export default NotFound;