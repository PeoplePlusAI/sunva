import React from "react";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import { InitializeProjectSetup } from "Views/Common/Docs/InitializeProjectSetup";
import Login from "Views/Common/Docs/Login";
import Error from "Views/Common/Docs/error";
import Register from "Views/Common/Docs/Register";
import Layout from "Views/Main/Layout/Layout";
import Home from "Views/Main/Docs/Home";
import Conversations from "Views/Main/Docs/Conversations";
import Settings from "Views/Main/Docs/Settings";
import Transcription from "Views/Main/Docs/Transcription";


const App = () => {
  return (
    <HelmetProvider>
      <ToastContainer theme='light' />
      <Routes>
        <Route element={<InitializeProjectSetup />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<Layout />}>
            <Route path="settings" element={<Settings />} />
            <Route path="home" element={<Home />} />
            <Route path="transcription" element={<Transcription />} />
            <Route path="conversation" element={<Conversations />} />
          </Route>

          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </HelmetProvider >
  )
}
export default App;