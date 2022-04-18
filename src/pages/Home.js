import { Box } from "@mui/system";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../context/LoginProvider";

const Home = ({ open }) => {
  const navigate = useNavigate();
  const { user, handleLogout } = useLogin();
  const [roomName, setRoomName] = useState(1);

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
        Public Servers
      </Box>
    </Box>

    // <div
    //     style={{
    //       width: "500px",
    //       height: "500px",
    //       display: "flex",
    //       alignItems: "center",
    //       justifyContent: "center",
    //       flexDirection: "column",
    //     }}
    //   >
    //     <div style={{ marginBottom: "10px" }}>
    //       <div style={{ marginBottom: "10px" }}>
    //         Welcome back {user?.displayName}
    //       </div>
    //     </div>
    //     <form
    //       style={{
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "center",
    //       }}
    //     >
    //       <div style={{ marginBottom: "20px" }}>
    //         <label htmlFor="room-name">Room name : </label>
    //         <input
    //           onChange={(event) => setRoomName(event.target.value)}
    //           name="room-name"
    //           id="room-name"
    //           type="string"
    //         />
    //       </div>
    //       <div
    //         style={{ display: "flex", flexDirection: "column", width: "100px" }}
    //       >
    //         <button
    //           type="submit"
    //           onClick={() => navigate(`/${roomName}`)}
    //           style={{ marginBottom: "5px" }}
    //         >
    //           Create room
    //         </button>
    //         <button onClick={handleLogout}>Logout</button>
    //       </div>
    //     </form>
    //   </div>
  );
};

export default Home;
