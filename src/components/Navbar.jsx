import {
  Avatar,
  Button,
  CssBaseline,
  Divider,
  Grid,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLogin } from "../context/LoginProvider";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { styled, useTheme } from "@mui/material/styles";
import Home from "../pages/Home";
import CreateServer from "../pages/CreateServer";
import JoinServer from "../pages/JoinServer";
import EditIcon from "@mui/icons-material/Edit";
import HomeIcon from "@mui/icons-material/Home";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import MessageIcon from "@mui/icons-material/Message";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import StorageIcon from "@mui/icons-material/Storage";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../config/firebase";

const drawerWidth = 340;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  boxShadow: "none",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),

    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Navbar = ({ val, openParent, tabParent, room }) => {
  let navigate = useNavigate();
  const { user, handleLogout } = useLogin();

  const roomName = room ? room[1].split("%20").join(" ") : null;
  const roomId = room ? room[2] : null;

  const theme = useTheme();
  const [tab, setTab] = useState(1);
  const [open, setOpen] = React.useState(true);
  const [showServ, setShowServ] = useState(true);
  const [publicRooms, setPublicRooms] = useState([]);

  useEffect(() => {
    openParent(open);
    tabParent(tab);
  }, [open, tab]);

  const handleServer = () => {
    setShowServ(!showServ);
    val(showServ);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const communityRef = collection(firestore, "communities");
    const q = query(
      communityRef,
      where("public", "==", true),
      orderBy("createdAt", "desc"),
      limit(10)
    );
    const querySnapshot = onSnapshot(q, (snapshot) => {
      setPublicRooms([]);
      if (snapshot.docs.length !== 0) {
        snapshot.docs.map((doc) => {
          setPublicRooms((room) => [...room, { id: doc.id, data: doc.data() }]);
        });
      }
    });

    return () => {
      if (querySnapshot) {
        querySnapshot();
      }
    };
  }, []);

  const navList = [
    { val: 1, name: "Home" },
    { val: 2, name: "Create Server" },
    { val: 3, name: "Join Server" },
  ];

  const channels = [
    { name: "Server Info", Icon: StorageIcon, url: "" },
    { name: "Text Channel 1", Icon: MessageIcon, url: "text" },
    { name: "Video Channel 1", Icon: VideoLibraryIcon, url: "video" },
    { name: "Pdf Channel 1", Icon: PictureAsPdfIcon, url: "pdf" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        style={{ backgroundColor: "#393E46" }}
        open={open}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Stack
            spacing="3"
            direction="row"
            display="flex"
            justifyContent="space-between"
          >
            {room ? (
              <Stack direction="row" alignItems={"center"}>
                <IconButton onClick={() => navigate("/")}>
                  <HomeIcon sx={{ color: "white", fontSize: "30px" }} />
                </IconButton>
                <Typography paddingTop={"7px"} fontSize="20px">
                  {roomName}
                </Typography>
              </Stack>
            ) : (
              <>
                <Box display="flex" minWidth={"100%"}>
                  {navList.map((item, index) => (
                    <Button
                      key={index}
                      onClick={() => {
                        setTab(item.val);
                      }}
                      variant="text"
                      style={{ color: "white" }}
                    >
                      {item.name}
                    </Button>
                  ))}
                </Box>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{
          sx: {
            backgroundColor: "#393E46",
            "&::-webkit-scrollbar": {
              width: "0",
              height: "0",
            },
          },
        }}
      >
        <DrawerHeader style={{ backgroundColor: "#393E46" }}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon style={{ color: "white" }} />
            ) : (
              <ChevronLeftIcon style={{ color: "white" }} />
            )}
          </IconButton>
        </DrawerHeader>
        {/* <Divider /> */}
        <Stack
          direction="column"
          height={room ? null : "50vh"}
          spacing={2}
          sx={{ padding: "20px", overflow: "hidden" }}
        >
          <Box
            sx={{
              display: "flex",
              direction: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box>
              <Avatar
                // alt={user?.displayName}
                src="/broken-image.jpg"
                // src="/images/images.jpg"
                sx={{
                  bgcolor: "grey",
                  border: "2px solid white",
                  height: `${open ? "15vh" : "5vh"}`,
                  width: `${open ? "15vh" : "5vh"}`,
                  fontSize: `${open ? "4em" : "1em"}`,
                }}
              />
            </Box>
            {open && (
              <Box sx={{ paddingLeft: "20px" }}>
                <Stack>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "600", color: "white" }}
                  >
                    {user?.displayName}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "600", color: "#10B9AE" }}
                  >
                    {user?.username}
                  </Typography>
                </Stack>
              </Box>
            )}
          </Box>
          {open ? (
            <Button
              variant="contained"
              sx={{
                bgcolor: "black",
                width: "100%",
                "&:hover": { bgcolor: "white", color: "black" },
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <IconButton variant="contained">
              <EditIcon
                fontSize="small"
                sx={{
                  bgcolor: "black",
                  color: "white",
                  width: "5vh",
                  height: "5vh",
                  "&:hover": { bgcolor: "white", color: "black" },
                  padding: "8px",
                  borderRadius: "5px",
                }}
              />
            </IconButton>
          )}
          {open ? (
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                bgcolor: "black",
                width: "100%",
                "&:hover": { bgcolor: "white", color: "black" },
              }}
            >
              Logout
            </Button>
          ) : (
            <IconButton variant="contained" onClick={handleLogout}>
              <ExitToAppIcon
                fontSize="small"
                sx={{
                  bgcolor: "black",
                  color: "white",
                  width: "5vh",
                  height: "5vh",
                  "&:hover": { bgcolor: "white", color: "black" },
                  padding: "8px",
                  borderRadius: "5px",
                }}
              />
            </IconButton>
          )}
        </Stack>
        {open && (
          <Typography
            variant="h6"
            padding="20px"
            paddingBottom="10px"
            color="white"
          >
            {room ? "Channels" : "Recent Rooms"}
          </Typography>
        )}
        {open && !room && (
          <Stack
            padding="20px"
            spacing={1}
            overflow="auto"
            sx={{
              "&::-webkit-scrollbar": {
                width: "0",
                height: "0",
              },
            }}
          >
            {publicRooms.map((item, i) => (
              <Button
                key={i}
                variant="contained"
                // color="secondary"
                sx={{
                  borderColor: "#3D6974",
                  color: "white",
                  bgcolor: "#3D6974",
                  "&:hover": {
                    bgcolor: "white",
                    color: "#3D6974",
                  },
                }}
                onClick={() =>
                  navigate(`/${item.data.community_name}/${item.id}`)
                }
              >
                {item.data.community_name}{" "}
              </Button>
            ))}
            {publicRooms.length === 0 && (
              <Typography sx={{ color: "white", fontSize: "20px" }}>
                NO RECENT ROOMS
              </Typography>
            )}
          </Stack>
        )}
        {room && (
          <Stack
            padding="0 20px"
            spacing={1}
            overflow="auto"
            justifyContent={"flex-start"}
            sx={{
              "&::-webkit-scrollbar": {
                width: "0",
                height: "0",
              },
            }}
          >
            {channels.map(({ name, Icon, url }, index) => (
              <IconButton
                variant="contained"
                key={index}
                sx={{
                  bgcolor: `${open ? "#505762" : null}`,
                  borderRadius: `${open ? "10px" : "0"}`,
                  "&:hover": { bgcolor: `${open ? "#505762" : null}` },
                }}
                onClick={() => navigate(`/${room[1]}/${roomId}/${url}`)}
              >
                <Icon
                  fontSize="small"
                  sx={{
                    bgcolor: "#505762",
                    color: "white",
                    width: "5vh",
                    height: "5vh",
                    //   "&:hover": { bgcolor: "white", color: "black" },
                    padding: "8px",
                    borderRadius: "5px",
                  }}
                />
                {open && <Typography color={"white"}>{name}</Typography>}
              </IconButton>
            ))}
          </Stack>
        )}
      </Drawer>
    </Box>
  );
};

export default Navbar;
