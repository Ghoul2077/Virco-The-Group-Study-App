import {
  Box,
  Stack,
  TextField,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/LoginProvider";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, firestore } from "../config/firebase";
import toast from "react-hot-toast";
import { async } from "@firebase/util";

function CreateServer({ open }) {
  const navigate = useNavigate();
  const { user, handleLogout } = useLogin();
  const [tagList, setTagList] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [publicServer, setPublicServer] = useState(false);
  const data = {
    community_name: roomName,
    createdAt: serverTimestamp(),
    public: publicServer,
    tags: tagList,
    createdBy: user.uid,
    host: user.uid,
    members: [user?.uid],
  };

  const handleRoomCreation = async (e) => {
    console.log(tagList);
    console.log(roomName);
    e.preventDefault();

    try {
      const docRef = doc(firestore, "users", user.uid);
      const collRef = collection(
        docRef,
        `${publicServer ? "public_server" : "private_server"}`
      );

      const serverCreated = await addDoc(collRef, data);
      await setDoc(doc(firestore, "communities", serverCreated.id), data);

      navigate(`/${roomName}/${serverCreated.id}`);
    } catch ({ message }) {
      toast.error(message);
      console.log(message);
    }
  };

  const handleType = (event, newType) => {
    if (newType !== null) {
      setPublicServer(newType);
    }
  };

  const topTags = ["Physics", "Maths", "Chemistery", "Biology"];
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
        Create Server
      </Box>
      <Box paddingTop="10px">
        <Typography color="white" paddingTop={"20px"} variant="h5">
          Welcome back {user?.displayName}!!
        </Typography>
        <Stack direction="row" spacing={2} paddingTop="50px">
          <Stack direction="column" spacing={4}>
            <Typography paddingTop="10px" color="white">
              Room Name:
            </Typography>
            <Typography paddingTop="0px" color="white">
              Room Tags:
            </Typography>
          </Stack>
          <form>
            <Stack direction="column" spacing={2}>
              <TextField
                name="Room Name"
                //   helperText="Please enter your name"
                onChange={(event) => {
                  setRoomName(event.target.value);
                }}
                id="room name"
                type={"string"}
                size="small"
                required
                sx={{
                  bgcolor: "white",
                  borderRadius: "10px",
                }}
                //   label="Name"
              />
              <Autocomplete
                multiple
                id="tags-filled"
                options={topTags.map((option) => option)}
                value={tagList}
                onChange={(event, newVal) => {
                  setTagList(newVal);
                }}
                // defaultValue={[top100Films[13].title]}
                freeSolo
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="Tags"
                    size="small"
                    sx={{
                      bgcolor: "white",
                      borderRadius: "10px",
                      minWidth: "210px",
                    }}
                  />
                )}
              />
              <ToggleButtonGroup
                value={publicServer}
                exclusive
                color="warning"
                onChange={handleType}
                aria-label="serverType"
              >
                <ToggleButton value={true} sx={{ color: "white" }}>
                  Public
                </ToggleButton>
                <ToggleButton
                  value={false}
                  sx={{ color: "white" }}
                  aria-label="centered"
                >
                  Private
                </ToggleButton>
              </ToggleButtonGroup>

              <Button
                variant="contained"
                type="submit"
                onClick={handleRoomCreation}
                sx={{
                  backgroundColor: "#10B9AE",
                  "&:hover": { bgcolor: "#3D6974" },
                }}
              >
                Create Room
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
      {/* <div
        style={{
          width: "500px",
          height: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <div style={{ marginBottom: "10px" }}>
            Welcome back {user?.displayName}
          </div>
        </div>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="room-name">Room name : </label>
            <input
              onChange={(event) => setRoomName(event.target.value)}
              name="room-name"
              id="room-name"
              type="string"
            />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", width: "100px" }}
          >
            <button
              type="submit"
              onClick={() => navigate(`/${roomName}`)}
              style={{ marginBottom: "5px" }}
            >
              Create room
            </button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </form>
      </div> */}
    </Box>
  );
}

export default CreateServer;
