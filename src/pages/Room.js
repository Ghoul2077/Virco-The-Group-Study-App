import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import Navbar from "../components/Navbar";
import PDF from "../components/PDF";
import Servers from "../components/Servers";
import VideoPlayer from "../components/VideoPlayer";
import { useLogin } from "../context/LoginProvider";

const socket = socketIOClient(`http://localhost:4000`);

const Room = ({ open }) => {
  const { user } = useLogin();
  const { room } = useParams();
  let location = useLocation();

  useEffect(() => {
    console.log(room);
  }, [room]);

  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [host, setHost] = useState("");

  function handleSend(event) {
    socket.emit(
      "sendMessage",
      {
        message: msg,
      },
      () => setMsg("")
    );
    event.preventDefault();
  }

  useEffect(() => {
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

    socket.on("messagesBroadcast", (messages) => {
      setMessages(messages);
    });

    return () => {
      socket.emit("leaveRoom", socket.removeAllListeners);
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
          //   alignItems: "center",
          // overflowX: "scroll",
          // borderRadius: "10px 10px 0px 0px",
          // "&::-webkit-scrollbar": {
          //   width: "0",
          //   height: "0",
          // },
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
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: "1",
          p: "100px",
          paddingLeft: `${open ? "380px" : "100px"}`,
          bgcolor: "#556270",
          height: "100vh",
        }}
      ></Box>
      <Servers room={true} />
    </div>
    // <div style={{ display: "flex", padding: "100px" }}>
    //   <div style={{ marginRight: "30px" }}>
    //     <p style={{ fontWeight: "bold" }}>Room : {room}</p>
    //     <p>Current host : {host}</p>
    //     <div>Connected Users : </div>
    //     {users.map((username, index) => (
    //       <p key={index}>{username}</p>
    //     ))}
    //   </div>
    //   <VideoPlayer socket={socket} />
    //   <PDF socket={socket} />
    //   <div>
    //     <div>Chat</div>
    //     <div
    //       style={{
    //         height: "300px",
    //         width: "300px",
    //         border: "1px solid black",
    //         marginBottom: "5px",
    //         borderRadius: "3px",
    //       }}
    //     >
    //       {messages.map(({ sender, message }, index) => (
    //         <div key={index}>
    //           {sender} : {message}
    //         </div>
    //       ))}
    //     </div>
    //     <form>
    //       <input
    //         style={{ width: "250px", marginRight: "5px" }}
    //         value={msg}
    //         onChange={(event) => setMsg(event.target.value)}
    //         type="string"
    //       />
    //       <button onClick={handleSend} type="submit">
    //         Send
    //       </button>
    //     </form>
    //   </div>
    // </div>
  );
};

export default Room;
