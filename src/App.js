import React from "react";
import { Routes, Route } from "react-router-dom";
import { useLogin } from "./context/LoginProvider";
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
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:room" element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
