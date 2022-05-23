import { Button, Divider, Stack, Typography } from "@mui/material";
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

const socket = socketIOClient(`https://group-study-app.herokuapp.com/`);
// const socket = socketIOClient(`http://localhost:4000`);

const Room = ({ open, serverInfo }) => {
  const { user } = useLogin();
  const { room } = useParams();
  const location = useLocation();
  const [path, setPath] = useState();
  const [users, setUsers] = useState({});
  const [host, setHost] = useState("");

  const [memberData, setMemberData] = useState([]);

  useEffect(() => {
    setMemberData([]);
    let docSnap = [];
    serverInfo.members.map(async (userId) => {
      const docRef = doc(firestore, "users", userId);
      docSnap.push(
        onSnapshot(docRef, (doc) => {
          setMemberData((memberData) => [
            ...memberData,
            { data: doc.data(), id: doc.id },
          ]);
        })
      );
    });
    return () => {
      docSnap.map((unsubscribe) => unsubscribe());
    };
  }, [serverInfo]);

  useEffect(() => {
    setPath(location.pathname.split("/")[2]);
  }, [location]);

  useEffect(() => {
    setHost("");
    setUsers({});

    socket.emit("joinRoom", { roomId: room, username: user.displayName });

    socket.on("newJoinee", (username) =>
      toast.success(`${username} just joined the room`)
    );

    socket.on("roomData", (users) => {
      setUsers(users);
    });

    socket.on("newHost", (hostData) => {
      console.log(hostData);
      setHost(hostData);
    });

    return () => {
      socket.removeAllListeners();
      socket.emit("leaveRoom");
    };
  }, [room, user.displayName]);

  useEffect(() => {
    if (host) {
      if (host?.socketId === socket.id) {
        toast.success(`You are controlling the syncing`);
      } else {
        toast.success(`${host?.name} is controlling the syncing`);
      }
    }
  }, [host]);

  console.log(users);
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
          <Typography color="white">Sync Controller : {host?.name}</Typography>
          <Typography variant="h5" color={"white"} paddingTop="20px">
            Users Connected
          </Typography>
          {Object.keys(users)
            .sort((val1, val2) => users[val1].localeCompare(users[val2]))
            .map((socketId, index) => (
              <Stack
                direction={"row"}
                key={index}
                sx={{
                  textTransform: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "#272b30",
                  padding: "4px 4px 4px 7px",
                  borderRadius: "5px",
                  marginTop: "5px",
                  width: "15vw",
                }}
              >
                <Typography color="white" paddingLeft={"3px"}>
                  {users[socketId]}
                </Typography>
                {host.socketId === socketId && (
                  <Typography color="white" paddingRight={"10px"}>
                    Host
                  </Typography>
                )}
                {host.socketId === socket.id && (
                  <Button
                    onClick={() => socket.emit("makeHost", { socketId })}
                    size="small"
                    sx={{
                      textTransform: "none",
                      bgcolor: "#3D6974",
                      margin: "5px",
                      color: "white",
                      display: `${
                        host.socketId === socketId ? "none" : "inherit"
                      }`,
                    }}
                  >
                    Make Host
                  </Button>
                )}
              </Stack>
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
      <Servers initialState={false} room={true} />
    </div>
  );
};

export default Room;
