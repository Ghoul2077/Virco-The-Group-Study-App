import { Box } from "@mui/material";
import React from "react";

function JoinServer({ open }) {
  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "white",
          width: `${open ? "72vw" : "90vw"}`,
          transition: "width 0.3s",
          padding: "15px",
          borderRadius: "5px",
          fontSize: "30px",
          fontWeight: "800",
          color: "#3D535F",
        }}
      >
        Join Servers
      </Box>
    </Box>
  );
}

export default JoinServer;
