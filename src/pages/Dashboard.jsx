import { Box } from "@mui/material";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Servers from "../components/Servers";
import CreateServer from "./CreateServer";
import Home from "./Home";
import JoinServer from "./JoinServer";

function Dashboard({ showList, open, tab }) {
  //   const [showList, setShowList] = useState();
  //   const handleData = (data) => {
  //     setShowList(data);
  //   };
  return (
    <div>
      {/* <Navbar val={handleData} /> */}
      <Box
        component="main"
        sx={{
          flexGrow: "1",
          p: "100px",
          paddingLeft: `${open ? "380px" : "100px"}`,
        }}
      >
        {/* <DrawerHeader /> */}
        <img
          src="/images/bg.png"
          alt="background"
          style={{
            position: "fixed",
            top: "0",
            bottom: "0",
            left: `${open ? "15%" : "0"}`,
            // height: "100%",
            width: "100%",
            zIndex: "-1",
            // maxHeight: "250px",
            objectFit: "cover",
            transition: "left 0.3s",
          }}
        />
        {tab === 1 && <Home open={open} />}
        {tab === 2 && <CreateServer open={open} />}
        {tab === 3 && <JoinServer open={open} />}
      </Box>
      <Servers initialState={true} room={false} />
    </div>
  );
}

export default Dashboard;
