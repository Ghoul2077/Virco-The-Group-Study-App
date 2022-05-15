import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import socketIOClient from "socket.io-client";
import Navbar from "../components/Navbar";
import PDF from "../components/PDF";
import Servers from "../components/Servers";
import VideoPlayer from "../components/VideoPlayer";
import { useLogin } from "../context/LoginProvider";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const socket = socketIOClient(`https://group-study-app.herokuapp.com`);
// window.scrollTo(0, document.getElementById("scrollingContainer").scrollHeight);

const Room = ({ open }) => {
  const { user } = useLogin();
  const { room } = useParams();
  let location = useLocation();
  const [path, setPath] = useState();
  const messageBoxRef = useRef(null);

  useEffect(() => {
    setPath(location.pathname.split("/")[2]);
  }, [location]);

  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [host, setHost] = useState("");

  function handleSend(event) {
    if (msg !== "") {
      socket.emit(
        "sendMessage",
        {
          message: msg,
        },
        () => setMsg("")
      );
    }
    event.preventDefault();
  }

  useEffect(() => {
    setMsg("");
    setMessages([]);
    
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
      messageBoxRef.current?.scrollTo(0, messageBoxRef.current?.scrollHeight);
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
        <Divider sx={{ color: "white" }} />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: "1",
          p: "100px",
          paddingLeft: `${open ? "360px" : "90px"}`,
          bgcolor: "#556270",
          height: `${path === "pdf" ? "100%" : "100vh"}`,
        }}
      >
        {/*---------- text channel------------- */}
        <div
          style={{
            display: `${
              path === undefined || path === "text" ? "inherit" : "none"
            }`,
          }}
        >
          <Box
            ref={messageBoxRef}
            sx={{
              position: "fixed",
              height: "70%",
              overflowY: "auto",
              width: `${open ? "55vw" : "72vw"}`,
              bottom: "20vh",
              "&::-webkit-scrollbar": {
                width: "0",
                height: "0",
              },
              // display: "flex",
              // flexDirection: "column-reverse",
            }}
          >
            {messages.map(({ sender, message }, index) => (
              <Stack
                alignItems={"center"}
                padding="8px"
                direction={"row"}
                key={index}
              >
                <Avatar
                  sx={{ height: "40px", width: "40px" }}
                  src="/broken-image.jpg"
                />
                <Stack direction={"column"} paddingLeft="10px">
                  <Typography color={"white"} sx={{ fontSize: "12px" }}>
                    {sender}
                  </Typography>
                  <Typography
                    color={"white"}
                    sx={{ fontSize: "16px", fontWeight: "300" }}
                  >
                    {message}
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Box>
          <Stack
            alignItems={"center"}
            direction={"row"}
            sx={{ bottom: "12vh", position: "fixed" }}
          >
            <form>
              <TextField
                placeholder="Type your message here"
                value={msg}
                onChange={(event) => setMsg(event.target.value)}
                required
                InputProps={{
                  sx: {
                    color: "white",
                  },
                }}
                sx={{
                  backgroundColor: "black",
                  width: `${open ? "50vw" : "62vw"}`,
                  //   transition: "width 0.3s",
                  borderRadius: "5px 0 0 5px",
                  fontSize: "30px",
                  fontWeight: "800",
                  opacity: "50%",

                  // marginBottom: "15vh",
                  //   height: "70px",
                }}
              />
              <Button
                variant="contained"
                onClick={handleSend}
                type="submit"
                sx={{
                  width: `${open ? "5vw" : "10vw"}`,
                  height: "55px",
                  borderRadius: "0 5px 5px 0",
                  fontSize: "15px",
                  backgroundColor: "#10B9AE",
                  "&:hover": { bgcolor: "#3D6974" },
                }}
              >
                Send
              </Button>
            </form>
          </Stack>
        </div>
        {/*---------- text channel------------- */}

        {/*---------- video channel------------ */}
        <div
          style={{
            display: `${path === "video" ? "inherit" : "none"}`,
          }}
        >
          <VideoPlayer socket={socket} open={open} />
        </div>
        {/*---------- video channel------------ */}

        {/*----------- PDF channel------------ */}
        <div
          style={{
            display: `${path === "pdf" ? "inherit" : "none"}`,
          }}
        >
          <Typography color={"white"} variant="h5" paddingBottom={"10px"}>
            Add PDF
          </Typography>

          <IconButton sx={{ "&:hover": { borderRadius: "10px" } }}>
            <Box
              sx={{
                width: `${open ? "52vw" : "72vw"}`,
                border: "2px dashed white",
                display: "flex",
                justifyContent: "center",
                borderRadius: "10px",
                padding: "20px",
              }}
            >
              <AddCircleIcon sx={{ color: "white", fontSize: "50px" }} />
            </Box>
          </IconButton>
          <Typography
            color={"white"}
            variant="h5"
            paddingBottom={"10px"}
            paddingTop={"10px"}
          >
            Select PDF
          </Typography>
          <Stack
            direction={"row"}
            sx={{
              backgroundColor: "#393E46",
              width: `${open ? "52vw" : "72vw"}`,
              padding: "10px",
              borderRadius: "10px",
              "&::-webkit-scrollbar": {
                width: "0",
                height: "0",
              },
              overflowX: "auto",
            }}
          >
            <PictureAsPdfIcon
              sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
            />
            <PictureAsPdfIcon
              sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
            />
            <PictureAsPdfIcon
              sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
            />
            <PictureAsPdfIcon
              sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
            />
            <PictureAsPdfIcon
              sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
            />
            <PictureAsPdfIcon
              sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
            />
            <PictureAsPdfIcon
              sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
            />
            <PictureAsPdfIcon
              sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
            />
            <PictureAsPdfIcon
              sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
            />
            <PictureAsPdfIcon
              sx={{ color: "white", fontSize: "50px", paddingLeft: "10px" }}
            />
          </Stack>
          <div style={{ paddingTop: "50px" }}>
            <PDF socket={socket} />
          </div>
        </div>
        {/*----------- PDF channel------------ */}
      </Box>
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
