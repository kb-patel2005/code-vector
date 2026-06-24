import React , {useEffect} from "react";
import Home from "./pages/Home";
import { Outlet } from "react-router-dom";
import socket from "./socket";
import "./app.css"

function App() {

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to krishchannel with id:", socket.id);

      socket.emit("joinChannel", "krishchannel");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return <Outlet />
}

export default App;
