import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../config/firebase";
import toast from "react-hot-toast";

function JoinServer({ open }) {
  const [link, setLink] = useState("");
  const [firebaseQuery, setFirebaseQuery] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(firebaseQuery) {
      setIsQuerying(true);
  
      (async function() {
        const communitiesRef = collection(firestore, "communities");
        const q = query(communitiesRef, where("community_name", "==", firebaseQuery));
        const querySnapshot = await getDocs(q);
        if(querySnapshot.docs.length > 0) {
          navigate(`/${link}`);
        } else {
          toast.error("Server does not exist");
        }
      })()
  
      setIsQuerying(false);
      setFirebaseQuery("");
    }
  }, [firebaseQuery])

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
      <form onSubmit={(e) => {
          e.preventDefault();
          if(!isQuerying) {
            setFirebaseQuery(link);
          }
      }}>
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
            type="submit"
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
            {isQuerying ? <CircularProgress /> : "Join"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default JoinServer;
