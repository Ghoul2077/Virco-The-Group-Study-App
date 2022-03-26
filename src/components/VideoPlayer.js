import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ socket }) => {
  const playerRef = useRef(null);
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=8FAUEv_E_xQ");
  const [inputText, setInputText] = useState(url);
  const [playing, setPlaying] = useState(false);

  function handleSubmit(event) {
    setUrl(inputText);
    event.preventDefault();
  }

  useEffect(() => {
    if (socket && playerRef.current) {
      socket.on("updateVideoProgressTime", (seconds) => {
        console.log(Math.abs(playerRef.current.getCurrentTime() - seconds));
        if (Math.abs(playerRef.current.getCurrentTime() - seconds) > 0.25) {
          playerRef.current.seekTo(seconds);
        }
      });
      socket.on("pauseVideo", () => {
        setPlaying(false);
      });
      socket.on("startVideo", () => {
        setPlaying(true);
      });
      socket.on("updateVideoURL", (newURL) => {
        setUrl(newURL);
      });
    }
  }, [socket, playerRef]);

  useEffect(() => {
    if (socket && url) {
      socket.emit("updateVideoURL", url);
    }
  }, [socket, url]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <ReactPlayer
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
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", marginTop: "20px" }}
      >
        <label htmlFor="url">URL : </label>
        <input
          style={{ minWidth: "400px", marginRight: "5px" }}
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
          name="url"
          type="url"
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default VideoPlayer;
