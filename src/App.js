import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserAndRoomValidator from "./components/UserAndRoomValidator";
import { useLogin } from "./context/LoginProvider";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import Room from "./pages/Room";

function App() {
  const { user, isLoading } = useLogin();
  const [showList, setShowList] = useState();
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState(1);

  let location = useLocation();

  const handleData = (data) => {
    setShowList(data);
  };

  const handleOpen = (data) => {
    setOpen(data);
  };

  const handleTab = (data) => {
    setTab(data);
  };

  if (isLoading) {
    return <p>Loading</p>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="App" style={{ overflowX: "hidden" }}>
      <Navbar
        val={handleData}
        openParent={handleOpen}
        tabParent={handleTab}
        room={
          location.pathname !== "/" ? location.pathname.split("/")[1] : false
        }
      />
      <Routes>
        <Route
          path="/"
          element={<Dashboard showList={showList} open={open} tab={tab} />}
        />
        <Route path="/:room" element={<UserAndRoomValidator open={open} />} />
        <Route path="/:room/:channel" element={<Room open={open} />} />
      </Routes>
    </div>
  );
}

export default App;
