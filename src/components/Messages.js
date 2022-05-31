import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useLogin } from "../context/LoginProvider";

function Messages({ open }) {
  const { user } = useLogin();
  const { socket, fetchedMessages } = useOutletContext();
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState(fetchedMessages ?? []);
  const messageBoxRef = useRef(null);
  //   const [profileImage, setProfileImage] = useState("/broken-image.jpg");

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
    socket.on("messagesBroadcast", (message) => {
      setMessages(messages => [...messages, message]);
      messageBoxRef.current?.scrollTo(0, messageBoxRef.current?.scrollHeight);
    });

    socket.on("hydrateMessages", (messages) => {
      setMessages(messages);
    });
  }, [socket]);

  //   useEffect(() => {
  //     const storage = getStorage();
  //     getDownloadURL(ref(storage, `users/${user.uid}`))
  //       .then((url) => {
  //         setProfileImage(url);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }, [user.uid]);

  return (
    <>
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
              src={"/broken-image.jpg"}
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
    </>
  );
}

export default Messages;
