import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./navbar";
import CreatepPollPage from "./routes/create-poll-page";
import SettingsPage from "./routes/settings-page";
import IntructionsPage from "./routes/instructions-page";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<CreatepPollPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/instructions" element={<IntructionsPage />} />
      </Routes>
    </div>
  );
}

export default App;
