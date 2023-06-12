// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import ReactDOM from "react-dom/client";

export default function Leagues() {
  const [message, setMessage] = useState("");


  const myFunc= () =>{axios.get("http://localhost:8000/leagues")
  .then((res) => {
    setMessage(res.data.message);
  });}
  return (
    <>
    <div className="App">
      <h1>{message}</h1>
      <Button variant="primary" onClick={()=>myFunc()}>Primary</Button>
    </div>
    </>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Leagues />);