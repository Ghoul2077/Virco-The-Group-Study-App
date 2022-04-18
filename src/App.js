import React from "react";
import { Routes, Route } from "react-router-dom";
import { useLogin } from "./context/LoginProvider";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Room from "./pages/Room";

function App() {
  const { user, isLoading } = useLogin();

  if (isLoading) {
    return <p>Loading</p>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="App" style={{ overflowX: "hidden" }}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/:room" element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
