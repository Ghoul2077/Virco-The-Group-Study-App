import styled from "@emotion/styled";
import {
  Avatar,
  Box,
  IconButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import e from "cors";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from "react-router-dom";
import { firestore } from "../config/firebase";
import { useLogin } from "../context/LoginProvider";

function Servers({ initialState, room }) {
  const { user } = useLogin();
  const [list, setList] = useState([]);
  const [isVisible, setIsVisible] = useState(initialState);

  function handleToggle() {
    setIsVisible((visible) => !visible);
  }

  useEffect(() => {
    setList([]);
    const docRef = doc(firestore, "users", user.uid);
    const private_server = collection(docRef, "private_server");
    const public_server = collection(docRef, "public_server");
    const one = onSnapshot(private_server, (snap) => {
      snap.docs.map((doc) => {
        console.log(doc.id);
        setList((list) => [...list, { id: doc.id, data: doc.data() }]);
      });
    });
    const two = onSnapshot(public_server, (snap) => {
      snap.docs.map((doc) => {
        console.log("public", doc.id);
        setList((list) => [...list, { id: doc.id, data: doc.data() }]);
      });
    });

    return () => {
      if (one) {
        one();
      }
      if (two) {
        two();
      }
    };
  }, [user]);

  console.log("list", list);

  const ServerList = styled("div")(({ theme }) => ({
    zIndex: `${room ? null : "999999999"}`,
    maxWidth: "800px",
    position: "fixed",
    padding: "0px 10px 0px 10px",
    bottom: "0",
    width: `${room ? "100%" : "80%"}`,
    height: `${!isVisible ? "10px" : "70px"}`,
    background: "#D2D5D8",
    display: "flex",
    justifyContent: "start",
    borderRadius: "10px 10px 0px 0px",
    "&::-webkit-scrollbar": {
      width: "0",
      height: "0",
    },
  }));

  const ScrollableDiv = styled("div")(({ theme }) => ({
    overflowX: "scroll", 
    width: "100%",
    "&::-webkit-scrollbar": {
      width: "0",
      height: "0",
    },
  }));
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <ServerList>
        <button onClick={handleToggle} style={{ position: "absolute", right: 10, top: -24, background: "#D2D5D8", border: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          {isVisible ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
        </button>
        {/* <Typography sx={{ fontSize: "60px" }}>servers</Typography> */}
        <ScrollableDiv style={{ overflowX: "scroll", width: "100%" }}>
        <Stack
          direction="row"
          display={"flex"}
          justifyContent="center"
          width={"100%"}
        >
          {list.map((item, i) => (
            <Tooltip title={`${item.data.community_name}, Type : ${item.data.public ? "Public" : "Private"}`} arrow>
                <IconButton
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
              </Tooltip>
          ))}
          {list.length === 0 && <Typography>NO SERVERS JOINED</Typography>}
        </Stack>
        </ScrollableDiv>
      </ServerList>
    </Box>
  );
}

export default Servers;
