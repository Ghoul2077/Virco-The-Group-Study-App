import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Loader from "./components/Loader";
import Messages from "./components/Messages";
import Navbar from "./components/Navbar";
import PDF from "./components/PDF";
import UserAndRoomValidator from "./components/UserAndRoomValidator";
import VideoPlayer from "./components/VideoPlayer";
import { useLogin } from "./context/LoginProvider";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";

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
    return <Loader loaderText="Loading" />;
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
          location.pathname.split("/").length >= 3
            ? location.pathname.split("/")
            : false
        }
      />
      <Routes>
        <Route
          path="/"
          element={<Dashboard showList={showList} open={open} tab={tab} />}
        />
        <Route
          path="/:room/:roomId"
          element={<UserAndRoomValidator open={open} />}
        >
          <Route path="text" element={<Messages open={open} />} />
          <Route path="video" element={<VideoPlayer open={open} />} />
          <Route path="pdf" element={<PDF open={open} />} />
          {/* <Route
            path=""
            element={<Navigate to="text" />}
          /> */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
