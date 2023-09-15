import { React } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/auth/Auth";
import Home from "./components/pages/Home";
import ContextProviders from "./context/ContextProviders";

function App() {
  return (
    <>
      <ContextProviders>
        <BrowserRouter>
          <ToastContainer draggable={true} limit={3} autoClose={1500} theme="colored" newestOnTop={true}/>
          <Routes>
            <Route exect path="/" element={<Auth />} />
            <Route exect path="/home" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </ContextProviders>
    </>
  );
}

export default App;
