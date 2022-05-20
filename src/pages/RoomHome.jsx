import { async } from "@firebase/util";
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";
import { firestore } from "../config/firebase";
import { useLogin } from "../context/LoginProvider";

function RoomHome({ serverInfo, open, memberData }) {
  const { roomId } = useParams();
  const { user } = useLogin();
  const [hostName, setHostName] = useState();
  const [creater, setCreater] = useState();
  const [mail, setMail] = useState("");
  const [displayInvite, setDisplayInvite] = useState(false);
  const location = useLocation();

  useEffect(() => {
    (async function () {
      const docRef = doc(firestore, "users", serverInfo.host);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setHostName(docSnap.data().displayName);
      }

      if (serverInfo.host === serverInfo.createdBy) {
        setCreater(docSnap.data().displayName);
      } else {
        const docRef = doc(firestore, "users", serverInfo.createdBy);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCreater(docSnap.data().displayName);
        }
      }
    })();
  }, [serverInfo]);

  useEffect(() => {
    setMail("");
  }, [location]);

  useEffect(() => {
    if (mail === "") {
      setDisplayInvite(false);
    }
  }, [mail]);

  async function CheckUser() {
    const collRef = collection(firestore, "users");

    const q = query(collRef, where("email", "==", mail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length === 0) {
      toast.error("User Doesn't exist");
      return false;
    } else {
      const isMember = serverInfo.members.some(
        (member) => member === querySnapshot.docs[0].id
      );
      if (isMember) {
        toast.error("User Already Added");
        return false;
      } else {
        toast.success("Invited");
        return querySnapshot.docs[0].id;
      }
    }
  }

  async function AddUser(userId) {
    const docRef = doc(firestore, "communities", roomId);
    await updateDoc(docRef, {
      members: arrayUnion(userId),
    });
  }

  const handleInvite = (e) => {
    e.preventDefault();
    const userId = CheckUser();

    userId.then((result) => {
      if (result) {
        AddUser(result);
        setDisplayInvite(true);
      }
    });
  };

  const infoList = [
    {
      header: "CREATED ON",
      info: serverInfo.createdAt.toDate().toString(),
    },
    {
      header: "CREATED BY",
      info: creater,
    },
    {
      header: "SERVER TYPE",
      info: serverInfo.public ? "Public" : "Private",
    },

    {
      header: "HOST",
      info: hostName,
    },
  ];

  const handleKick = async (userId) => {
    const docRef = doc(firestore, "communities", roomId);
    await updateDoc(docRef, {
      members: arrayRemove(userId),
    });
  };

  const handleSwitch = async () => {
    const docRef = doc(firestore, "communities", roomId);
    await updateDoc(docRef, {
      public: !serverInfo.public,
    });
  };

  return (
    <div>
      <Box
        sx={{
          background: "linear-gradient(#890F0D 50%, #1B1A17 50%)",
          width: `${open ? "55vw" : "70vw"}`,
          borderRadius: "10px 10px 0 0",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "20px 80px 20px 60px",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: "white",
            fontWeight: "400",
          }}
        >
          {serverInfo.community_name}
        </Typography>
        <div>
          <Button
            variant={"contained"}
            color={"error"}
            size={"small"}
            sx={{ width: "150px", marginRight: "10px" }}
          >
            Leave Server
          </Button>
          {user.uid === serverInfo.host && (
            <Button
              variant={"contained"}
              color={"error"}
              size={"small"}
              sx={{ width: "150px" }}
            >
              Delete Server
            </Button>
          )}
        </div>
      </Box>
      <Box
        sx={{
          background: "#1B1A17",
          width: `${open ? "55vw" : "70vw"}`,
          padding: "0px 50px 50px 50px ",
          borderRadius: "0 0 10px 10px",
        }}
      >
        <Box
          sx={{
            background: "#3A3845",
            width: `${open ? "48vw" : "62vw"}`,
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          {infoList.map((item, index) => (
            <Box padding="5px" key={index}>
              <Typography
                sx={{ color: "white", opacity: "80%", fontSize: "16px" }}
              >
                {item.header}
              </Typography>
              <Typography
                sx={{ color: "white", fontSize: "13px", paddingTop: "5px" }}
              >
                {item.info}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
      {user.uid === serverInfo.host && (
        <Box
          sx={{
            background: "#1B1A17",
            width: `${open ? "55vw" : "70vw"}`,
            padding: "50px ",
            borderRadius: "0 0 10px 10px",
            marginTop: "10px",
          }}
        >
          <form onSubmit={handleInvite}>
            <TextField
              placeholder="Enter User's Email"
              value={mail}
              onChange={(event) => setMail(event.target.value)}
              name="email"
              id="email"
              aria-label="email"
              required
              type={"email"}
              InputProps={{
                sx: {
                  color: "white",
                },
              }}
              sx={{
                backgroundColor: "#3A3845",
                width: `${open ? "42vw" : "52vw"}`,
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
              disabled={displayInvite}
              sx={{
                width: `${open ? "5vw" : "10vw"}`,
                height: "55px",
                borderRadius: "0 15px 15px 0",
                fontSize: "15px",
                backgroundColor: "#10B9AE",
                "&:hover": { bgcolor: "#3D6974" },
                ":disabled": {
                  backgroundColor: "#3D6974",
                  color: "white",
                },
              }}
            >
              Invite
            </Button>
          </form>
          <Typography sx={{ color: "white", paddingTop: "10px" }}>
            Invite Link :
          </Typography>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(
                `https://virco.gg/${serverInfo.community_name}/${roomId}`
              );
              toast.success("Link Copied");
            }}
            size="small"
            sx={{
              backgroundColor: "#3A3845",
              width: `${open ? "47vw" : "62vw"}`,
              opacity: "50%",
              marginTop: "10px",
              color: "White",
              fontSize: "20px",
              fontWeight: "500",
            }}
          >
            https://virco.gg/{serverInfo.community_name}/{roomId}
          </Button>
        </Box>
      )}
      <Typography
        variant={"h4"}
        sx={{ color: "white", padding: "20px 0 20px 0" }}
      >
        MEMBERS
      </Typography>
      <Box
        sx={{
          backgroundColor: "#1B1A17",
          width: `${open ? "55vw" : "70vw"}`,
          marginTop: "10px",
          color: "white",
          fontSize: "20px",
          fontWeight: "500",
          padding: "20px",
        }}
      >
        {memberData.map((item, i) => (
          <Box
            padding="10px"
            display="flex"
            justifyContent={"space-between"}
            alignItems="center"
            key={i}
          >
            <Typography>{item.data.displayName}</Typography>
            <Stack spacing={2} direction="row">
              {user.uid === serverInfo.host && item.id !== serverInfo.host && (
                <>
                  <Button color="success" variant="contained" size="small">
                    Make Host
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleKick(item.id)}
                    variant="contained"
                    size="small"
                  >
                    KICK
                  </Button>
                </>
              )}
            </Stack>
          </Box>
        ))}
      </Box>
    </div>
  );
}

export default RoomHome;
