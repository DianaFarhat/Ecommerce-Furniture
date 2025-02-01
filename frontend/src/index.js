import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Route, RouterProvider, createRoutesFromElements, createBrowserRouter } from "react-router-dom"; 
import { Provider } from "react-redux";
import { store } from "./redux/store.js"; 
import Login from "./pages/Auth/Login.jsx"
import Register from './pages/Auth/Register.jsx'
// Define the router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
       <Route path="/login" element={<Login/>} />
       <Route path="/register" element={<Register/>} />

       
    </Route>
  )
);

// ✅ Wrap the entire application inside <Provider>
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>  
    <RouterProvider router={router} />
  </Provider>

  
);

console.log('App mounted'); // Add this to check if the render is happening

