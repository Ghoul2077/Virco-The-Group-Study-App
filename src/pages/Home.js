import { async } from "@firebase/util";
import {
  Autocomplete,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { firestore } from "../config/firebase";
import { useLogin } from "../context/LoginProvider";
import StorageIcon from "@mui/icons-material/Storage";

const Home = ({ open }) => {
  const navigate = useNavigate();

  const [tagList, setTagList] = useState([]);
  const [publicList, setPublicList] = useState([]);
  const topTags = ["Physics", "Maths", "Chemistery", "Biology"];

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const collRef = collection(firestore, "communities");
      const q = query(
        collRef,
        where("tags", "array-contains-any", tagList),
        where("public", "==", true)
      );

      const querySnapshot = await getDocs(q);
      setPublicList(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
      console.log(publicList);
    } catch ({ message }) {
      toast.error("Search For Tags");
    }
  };
  console.log(publicList.map((item) => item.data.createdAt.toDate()));

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
      <form onSubmit={handleSearch}>
        <Stack
          display="flex"
          direction={"row"}
          alignItems="center"
          marginTop="20px"
          marginBottom="20px"
        >
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
            sx={{
              input: {
                color: "white",
              },
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  color="primary"
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Enter tags to search"
                required
                sx={{
                  backgroundColor: "black",
                  width: `${open ? "60vw" : "80vw"}`,
                  //   transition: "width 0.3s",
                  borderRadius: "15px 0  0 15px",
                  fontSize: "30px",
                  fontWeight: "800",
                  opacity: "50%",
                  //   height: "70px",
                  input: {
                    color: "white",
                  },
                }}
              />
            )}
          />
          <Button
            type="submit"
            onClick={handleSearch}
            variant="contained"
            sx={{
              width: `${open ? "10vw" : "10vw"}`,
              height: "55px",
              borderRadius: "0 15px 15px 0",
              fontSize: `${open ? "15px" : "15px"}`,
              backgroundColor: "#10B9AE",
              "&:hover": { bgcolor: "#3D6974" },
            }}
          >
            Search
          </Button>
        </Stack>
      </form>
      {publicList ? (
        publicList.map((item) => (
          <Box
            key={item.id}
            sx={{
              backgroundColor: "black",
              width: `${open ? "60vw" : "87vw"}`,
              // transition: "width 0.3s",
              fontSize: "30px",
              fontWeight: "800",
              opacity: "70%",
              height: "70px",
              color: "white",
              padding: "15px",
              display: "flex",
              border: "1px solid grey",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontSize: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <StorageIcon sx={{ marginRight: "10px" }} />
              {item.data.community_name}
            </Typography>

            <Button
              size="small"
              onClick={() => navigate(`/${item.data.community_name}`)}
              sx={{
                width: `${open ? "10vw" : "10vw"}`,
                fontSize: `${open ? "15px" : "15px"}`,
                backgroundColor: "#10B9AE",
                "&:hover": { bgcolor: "#3D6974" },
                color: "white",
              }}
            >
              Join
            </Button>
          </Box>
        ))
      ) : (
        <Box>
          <Typography>NO RELATED SERVERS EXIST</Typography>
        </Box>
      )}
    </Box>
  );
};

export default Home;
