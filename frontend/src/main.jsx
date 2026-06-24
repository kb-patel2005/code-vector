import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import Home from "./pages/Home";
import AddProductForm from "./pages/AddProductForm";
import './index.css';

import "./App.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      { path: "" , element: <Home /> }, 
      { path: "add", element: <AddProductForm /> } 
    ]
  }
]);

const root = createRoot(document.getElementById("root"));
root.render(
  
    <RouterProvider router={router} />
  
);
