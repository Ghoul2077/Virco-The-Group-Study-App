import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
import toast from "react-hot-toast";
import { useLogin } from "../context/LoginProvider";

function JoinServer({ open }) {
  const [link, setLink] = useState("");
  const [firebaseQuery, setFirebaseQuery] = useState(false);
  const [isQuerying, setIsQuerying] = useState(false);
  const { user } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (firebaseQuery) {
      setIsQuerying(true);
      const commId = link.split("/");
      (async function () {
        const communitiesRef = doc(firestore, "communities", commId[4]);

        const querySnapshot = await getDoc(communitiesRef);
        if (querySnapshot.exists()) {
          const docRef = doc(firestore, "users", user.uid);

          const checkSubscribed = doc(
            docRef,
            querySnapshot.data().public ? "public_server" : "private_server",
            querySnapshot.id
          );

          const isJoined = await getDoc(checkSubscribed);

          if (isJoined.exists()) {
            toast.error("You have already joined");
          } else {
            const collRef = collection(
              docRef,
              querySnapshot.data().public ? "public_server" : "private_server"
            );

            setDoc(doc(collRef, querySnapshot.id), {
              community_name: querySnapshot.data().community_name,
              createdAt: querySnapshot.data().createdAt,
              public: querySnapshot.data().public,
              tags: querySnapshot.data().tags,
              createdBy: querySnapshot.data().createdBy,
              host: querySnapshot.data().host,
              joinedOn: serverTimestamp(),
            });

            navigate(`/${commId[3]}/${commId[4]}`);
          }
        } else {
          toast.error("Server does not exist");
        }
      })();

      setIsQuerying(false);
      setFirebaseQuery("");
    }
  }, [firebaseQuery]);

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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!isQuerying) {
            setFirebaseQuery(link);
          }
        }}
      >
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
