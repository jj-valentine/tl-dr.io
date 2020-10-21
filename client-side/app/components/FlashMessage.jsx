import React from "react";

function FlashMessage({ messages }) {
  return (
    <div className="floating-alerts">
      {
        messages.map((message, i) => {
          const alertClass = "alert-" + message[1];
          return (
            <div key={i} className={"alert text-center floating-alert shadow-sm " + alertClass}>
              {message[0]}
           </div>
          );
        })
      }
    </div>
  );
}

export default FlashMessage;