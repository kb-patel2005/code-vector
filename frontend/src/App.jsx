import React , {useEffect} from "react";
import Home from "./pages/Home";
import { Outlet } from "react-router-dom";
import socket from "./socket";

function App() {

  return <Outlet />
}

export default App;
