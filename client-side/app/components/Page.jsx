import React, { useEffect } from "react";

function Page(props) {
  // set standard template for title, and starts pages at top (on load/reload)
  useEffect(() => {
    window.document.title = `${props.title} | blogurt`;
    window.scrollTo(0, 0);
  }, [props.title]);
  
  return (
    <div className={"container py-md-5 " + (props.wide ? "" : "container--narrow")}>
      {props.children}
    </div>
  );
}

export default Page;
