import { Divider, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import Servers from "../components/Servers";
import { firestore } from "../config/firebase";
import { useLogin } from "../context/LoginProvider";
import RoomHome from "./RoomHome";

// const socket = socketIOClient(`https://group-study-app.herokuapp.com/`);
const socket = socketIOClient(`http://localhost:4000`);
// window.scrollTo(0, document.getElementById("scrollingContainer").scrollHeight);

const Room = ({ open, serverInfo }) => {
  const { user } = useLogin();
  const { room } = useParams();
  const location = useLocation();

  const [path, setPath] = useState();
  const [users, setUsers] = useState([]);
  const [host, setHost] = useState("");

  const [memberData, setMemberData] = useState([]);

  async function userData(userId) {
    const docRef = doc(firestore, "users", userId);
    const docSnap = onSnapshot(docRef, (doc) => {
      memberData.push({ data: doc.data(), id: doc.id });
    });
  }

  useEffect(() => {
    serverInfo.members.map((item) => {
      userData(item);
    });
  }, [serverInfo]);

  useEffect(() => {
    setPath(location.pathname.split("/")[2]);
  }, [location]);

  useEffect(() => {
    setHost("");

    socket.emit("joinRoom", { roomId: room, username: user.displayName });

    socket.on("newJoinee", (username) =>
      toast.success(`${username} just joined the room`)
    );

    socket.on("roomData", (users) => {
      setUsers(users);
    });

    socket.on("newHost", (newHostUsername) => {
      console.log("Called");
      setHost(newHostUsername);
    });

    return () => {
      socket.removeAllListeners();
      socket.emit("leaveRoom");
    };
  }, [room, user.displayName]);

  useEffect(() => {
    if (host) {
      toast.success(`${host} is the host`);
    }
  }, [host]);

  return (
    <div>
      <Box
        sx={{
          // zIndex: "999999999",
          position: "fixed",
          padding: "0px 10px 0px 10px",
          right: "0",
          width: "20%",
          height: "100%",
          background: "#393E46",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stack paddingTop="10vh" paddingRight="0%">
          <Typography color="white">Current Host : {host}</Typography>
          <Typography variant="h5" color={"white"} paddingTop="20px">
            Users Connected
          </Typography>
          {users.map((username, index) => (
            <Typography
              key={index}
              color="white"
              sx={{
                bgcolor: "#272b30",
                padding: "4px 4px 4px 7px",
                borderRadius: "5px",
                marginTop: "5px",
                width: "15vw",
              }}
            >
              {username}
            </Typography>
          ))}
        </Stack>
        <Divider sx={{ color: "white" }} />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: "1",
          p: "100px",
          paddingLeft: `${open ? "360px" : "90px"}`,
          bgcolor: "#556270",
          minHeight: "100vh",
        }}
      >
        <div style={{ display: "inherit" }}>
          <Outlet context={{ socket }} />
        </div>
        {(location.pathname.split("/")[3] === "" ||
          location.pathname.split("/")[3] === undefined) && (
          <RoomHome
            serverInfo={serverInfo}
            open={open}
            memberData={memberData}
          />
        )}
      </Box>
      <Servers room={true} />
    </div>
  );
};

export default Room;
