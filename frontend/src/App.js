import { React } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Notifications } from 'react-push-notification';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/auth/Auth";
import Home from "./components/pages/Home";
import PageNotFound from "./components/pages/PageNotFound";
import CustomPrompt from "./components/Models/CustomPrompt";

function App() {
  return (
    <>
      <BrowserRouter>
        <Notifications position="top-left"/>
        <ToastContainer draggable={true} limit={3} autoClose={1500} theme="colored" newestOnTop={true} position="bottom-right"/>
        <CustomPrompt/>
        <Routes>
          <Route exect path="/" element={<Auth />} />
          <Route exect path="/home" element={<Home />} />
          <Route exect path="/*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
