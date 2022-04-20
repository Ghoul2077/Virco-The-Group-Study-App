import { Box, Stack, TextField, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/LoginProvider";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";

function CreateServer({ open }) {
  const navigate = useNavigate();
  const { user, handleLogout } = useLogin();
  const [tagList, setTagList] = useState([]);
  const [roomName, setRoomName] = useState(1);
  const handleRoomCreation = () => {
    console.log(tagList);
    console.log(roomName);
    navigate(`/${roomName}`);
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
          <Stack direction="column" spacing={2}>
            <TextField
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
                  size="small"
                  required
                  sx={{
                    bgcolor: "white",
                    borderRadius: "10px",
                    minWidth: "210px",
                  }}
                />
              )}
            />
            <Button
              variant="contained"
              onClick={handleRoomCreation}
              sx={{
                backgroundColor: "#10B9AE",
                "&:hover": { bgcolor: "#3D6974" },
              }}
            >
              Create Room
            </Button>
          </Stack>
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
