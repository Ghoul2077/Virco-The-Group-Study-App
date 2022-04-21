import styled from "@emotion/styled";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const list = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function Servers({ val, room }) {
  const ServerList = styled("div")(({ theme }) => ({
    zIndex: `${room ? null : "999999999"}`,
    position: "fixed",
    padding: "0px 10px 0px 10px",
    bottom: "0",
    width: `${room ? "100%" : "80%"}`,
    height: `${val ? "0px" : "70px"}`,
    background: "#D2D5D8",
    // display: "flex",
    justifyContent: "center",
    //   alignItems: "center",
    overflowX: "scroll",
    borderRadius: "10px 10px 0px 0px",
    "&::-webkit-scrollbar": {
      width: "0",
      height: "0",
    },
    paddingLeft: `${room ? "5vw" : null}`,
  }));
  const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <ServerList>
        {/* <Typography sx={{ fontSize: "60px" }}>servers</Typography> */}
        <Stack direction="row" width={`${room ? null : "80%"}`}>
          {list.map((name) => (
            <IconButton key={name} onClick={() => navigate(`/${name}`)}>
              <Avatar
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
              >
                {name}
              </Avatar>
            </IconButton>
          ))}
        </Stack>
      </ServerList>
    </Box>
  );
}

export default Servers;
