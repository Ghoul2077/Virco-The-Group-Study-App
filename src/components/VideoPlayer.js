import { Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import ReactPlayer from "react-player";
import { useOutletContext } from "react-router-dom";

const VideoPlayer = ({ open }) => {
  const playerRef = useRef(null);
  const [url, setUrl] = useState(
    "https://www.youtube.com/watch?v=y17RuWkWdn8&ab_channel=WebDevSimplified"
  );

  const { socket } = useOutletContext();

  const [link, setLink] = useState(
    "https://www.youtube.com/watch?v=y17RuWkWdn8&ab_channel=WebDevSimplified"
  );
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (socket && playerRef.current) {
      socket.on("updateVideoProgressTime", (seconds) => {
        if (Math.abs(playerRef.current.getCurrentTime() - seconds) > 0.5) {
          playerRef.current.seekTo(seconds);
        }
      });
      socket.on("pauseVideo", () => {
        setPlaying(false);
      });
      socket.on("startVideo", () => {
        setPlaying(true);
      });
    }
  }, [socket, playerRef]);

  // useEffect(() => {
  //   if (socket && url) {
  //     socket.emit("updateVideoURL", url);
  //   }
  // }, [socket, url]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingLeft: `${open ? "3vw" : "5vw"}`,
      }}
    >
      <ReactPlayer
        height={"60vh"}
        width={open ? "50vw" : "62vw"}
        playing={playing}
        ref={playerRef}
        controls={true}
        onPlay={() => socket.emit("startVideo")}
        onPause={() => socket.emit("pauseVideo")}
        onProgress={({ playedSeconds }) =>
          socket.emit("syncVideo", playedSeconds)
        }
        progressInterval={1000}
        url={url}
      />
      <div style={{ marginTop: "20px" }}>
        <Typography htmlFor="url" color="white">
          URL :
        </Typography>
        <form>
          <TextField
            name="url"
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            required
            InputProps={{
              sx: {
                color: "white",
              },
            }}
            sx={{
              backgroundColor: "black",
              width: `${open ? "45vw" : "52vw"}`,
              //   transition: "width 0.3s",
              borderRadius: "5px 0 0 5px",
              fontSize: "30px",
              fontWeight: "800",
              opacity: "50%",

              // marginBottom: "15vh",
              //   height: "70px",
            }}
          />
          <Button
            variant="contained"
            onClick={(e) => {
              setUrl(link);
              e.preventDefault();
            }}
            type="submit"
            sx={{
              width: `${open ? "5vw" : "10vw"}`,
              height: "55px",
              borderRadius: "0 5px 5px 0",
              fontSize: "15px",
              backgroundColor: "#10B9AE",
              "&:hover": { bgcolor: "#3D6974" },
            }}
          >
            Search
          </Button>
        </form>
      </div>
    </div>
  );
};

export default VideoPlayer;
