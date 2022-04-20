import { Box } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/LoginProvider";

const Home = ({ open }) => {
  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "white",
          width: `${open ? "72vw" : "90vw"}`,
          // transition: "width 0.3s",
          padding: "15px",
          borderRadius: "5px",
          fontSize: "30px",
          fontWeight: "800",
          color: "#3D535F",
        }}
      >
        Public Servers
      </Box>
    </Box>
  );
};

export default Home;
