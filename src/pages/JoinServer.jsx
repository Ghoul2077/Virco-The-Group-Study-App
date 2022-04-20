import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

function JoinServer({ open }) {
  const [link, setLink] = useState("");
  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "white",
          width: `${open ? "72vw" : "90vw"}`,
          //   transition: "width 0.3s",
          padding: "15px",
          borderRadius: "5px",
          fontSize: "30px",
          fontWeight: "800",
          color: "#3D535F",
        }}
      >
        Join Servers
      </Box>
      <Typography variant="h5" paddingTop={"50px"} color="white">
        Use Link Here
      </Typography>
      <form>
        <Stack
          display="flex"
          direction={"row"}
          alignItems="center"
          marginTop="20px"
        >
          <TextField
            placeholder="Enter invite link to Join server"
            onChange={(event) => setLink(event.target.value)}
            required
            InputProps={{
              sx: {
                color: "white",
              },
            }}
            sx={{
              backgroundColor: "black",
              width: `${open ? "67vw" : "80vw"}`,
              //   transition: "width 0.3s",
              borderRadius: "15px 0  0 15px",
              fontSize: "30px",
              fontWeight: "800",
              opacity: "50%",
              //   height: "70px",
            }}
          />
          <Button
            variant="contained"
            sx={{
              width: `${open ? "5vw" : "10vw"}`,
              height: "55px",
              borderRadius: "0 15px 15px 0",
              fontSize: "15px",
              backgroundColor: "#10B9AE",
              "&:hover": { bgcolor: "#3D6974" },
            }}
          >
            Join
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default JoinServer;
