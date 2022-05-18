import styled from "@emotion/styled";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore } from "../config/firebase";
import { useLogin } from "../context/LoginProvider";

function Servers({ val, room }) {
  const { user } = useLogin();
  const [list, setList] = useState([]);

  useEffect(() => {
    const docRef = doc(firestore, "users", user.uid);
    const private_server = collection(docRef, "private_server");
    const public_server = collection(docRef, "public_server");
    const one = onSnapshot(private_server, (snap) => {
      snap.docs.map((doc) => {
        console.log(doc.id);
        list.push({ id: doc.id, data: doc.data() });
      });
    });
    const two = onSnapshot(public_server, (snap) => {
      snap.docs.map((doc) => {
        console.log(doc.id);
        list.push({ id: doc.id, data: doc.data() });
      });
    });
  }, [user, list]);

  console.log("list", list);

  const ServerList = styled("div")(({ theme }) => ({
    zIndex: `${room ? null : "999999999"}`,
    maxWidth: "800px",
    position: "fixed",
    padding: "0px 10px 0px 10px",
    bottom: "0",
    width: `${room ? "100%" : "80%"}`,
    height: `${val ? "0px" : "70px"}`,
    background: "#D2D5D8",
    display: "flex",
    justifyContent: "start",
    overflowX: "scroll",
    borderRadius: "10px 10px 0px 0px",
    "&::-webkit-scrollbar": {
      width: "0",
      height: "0",
    },
  }));
  const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <ServerList>
        {/* <Typography sx={{ fontSize: "60px" }}>servers</Typography> */}
        <Stack
          direction="row"
          display={"flex"}
          justifyContent="center"
          width={`${room ? "100%" : "100%"}`}
        >
          {list.map((item, i) => (
            <IconButton
              key={i}
              onClick={() =>
                navigate(`/${item.data.community_name}/${item.id}`)
              }
            >
              <Avatar
                alt={item.data.community_name.toUpperCase()}
                src="/broken-image.jpg"
                sx={{
                  bgcolor: "#3D535F",
                  width: "50px",
                  height: "50px",
                  fontSize: "30px",
                  border: "2px solid red",
                  "&:hover": {
                    background: "#2A7299",
                    border: "2px solid #0C2311",
                  },
                }}
              />
            </IconButton>
          ))}
          {list === [] && <Typography>NO SERVERS JOINED</Typography>}
        </Stack>
      </ServerList>
    </Box>
  );
}

export default Servers;
