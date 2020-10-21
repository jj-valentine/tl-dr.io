import React, { useState, useEffect } from "react";
// Component(s)
import Page from "./Page.jsx";


function AboutUs() {
  // const target = 200880;
  // const [count, setCount] = useState(0);
  // const [wait, setWait] = useState(0);
  
  // const [inc, setInc] = useState(1)
  // const [counterLive, setCounterLive] = useState(false);

  // useEffect(() => {
  //   console.log('wait: ', wait, ' inc: ', inc);
  //   if (counterLive && count < target) {
  //     if (wait < 10) setWait(wait + 1);
  //     const countInterval = setInterval(() => {
  //         setCount(count + inc);
  //         // if (inc >= 2) setInc(inc - 1);

  //       }, wait)
      
  //       return () => {
  //       clearInterval(countInterval);
  //     } 
  //   }  
   
  // }, [counterLive, count])

  // const handleCounterState = () => {
  //   setCounterLive(!counterLive)
  // }

  return (
    <Page title={"About Us"}>
      {/* <h2>About Us</h2>
      <p className="lead text-muted">Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis dolorum labore quisquam vel id dicta fuga! Ducimus, quo. Dolore commodi aliquid error veritatis consequuntur, excepturi cumque fuga eum incidunt doloremque?</p>
      <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. At qui enim rem totam voluptatum. Aut saepe temporibus, facilis ex a iste expedita minima dolorum dicta doloribus libero aliquid, quae maxime? Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat suscipit beatae eum, est soluta ducimus ratione et impedit sapiente, nihil, atque dignissimos adipisci? Totam atque officia quis voluptates sed veniam?</p>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita voluptates quisquam possimus tenetur, dicta enim rerum quis, quaerat id nobis provident quo dolorum sapiente temporibus facere non repellendus consequatur cupiditate!</p> */}
        <div className="containerrr">
          <div className="boxxx boxx1">1</div>
          <div className="boxxx boxx2">2</div>
          <div className="boxxx boxx3">3</div>
        </div>
    </Page>
  );
}

export default AboutUs;
